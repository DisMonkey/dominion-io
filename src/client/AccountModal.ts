import { html, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  PlayerGame,
  PlayerStatsTree,
  UserMeResponse,
} from "../core/ApiSchemas";
import { getRuntimeClientServerConfig } from "../core/configuration/ConfigLoader";
import { fetchPlayerById, getUserMe } from "./Api";
import { logOut, sendMagicLink } from "./Auth";
import {
  isFirebaseConfigured,
  signInWithGoogle,
} from "./auth/FirebaseAuth";
import "./components/baseComponents/stats/DiscordUserHeader";
import "./components/baseComponents/stats/GameList";
import "./components/baseComponents/stats/PlayerStatsTable";
import "./components/baseComponents/stats/PlayerStatsTree";
import { BaseModal } from "./components/BaseModal";
import "./components/CopyButton";
import "./components/CurrencyDisplay";
import "./components/Difficulties";
import { modalHeader } from "./components/ui/ModalHeader";
import { translateText } from "./Utils";

@customElement("account-modal")
export class AccountModal extends BaseModal {
  @state() private email: string = "";
  @state() private isLoadingUser: boolean = false;

  private userMeResponse: UserMeResponse | null = null;
  private statsTree: PlayerStatsTree | null = null;
  private recentGames: PlayerGame[] = [];

  constructor() {
    super();

    document.addEventListener("userMeResponse", (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.userMeResponse = customEvent.detail as UserMeResponse;
        if (this.userMeResponse?.player?.publicId === undefined) {
          this.statsTree = null;
          this.recentGames = [];
        }
      } else {
        this.statsTree = null;
        this.recentGames = [];
        this.requestUpdate();
      }
    });
  }

  private hasAnyStats(): boolean {
    if (!this.statsTree) return false;
    // Check if statsTree has any data
    return (
      Object.keys(this.statsTree).length > 0 &&
      Object.values(this.statsTree).some(
        (gameTypeStats) =>
          gameTypeStats && Object.keys(gameTypeStats).length > 0,
      )
    );
  }

  render() {
    const content = this.isLoadingUser
      ? this.renderLoadingSpinner(
          translateText("account_modal.fetching_account"),
        )
      : this.renderInner();

    if (this.inline) {
      return this.isLoadingUser
        ? html`<div class="${this.modalContainerClass}">
            ${modalHeader({
              title: translateText("account_modal.title"),
              onBack: () => this.close(),
              ariaLabel: translateText("common.back"),
            })}
            ${content}
          </div>`
        : content;
    }

    return html`
      <o-modal
        id="account-modal"
        title=""
        ?hideCloseButton=${true}
        ?inline=${this.inline}
        hideHeader
      >
        ${content}
      </o-modal>
    `;
  }

  private renderInner() {
    const isLoggedIn = !!this.userMeResponse?.user;
    const title = translateText("account_modal.title");
    const publicId = this.userMeResponse?.player?.publicId ?? "";
    const displayId = publicId || translateText("account_modal.not_found");

    return html`
      <div class="${this.modalContainerClass}">
        ${modalHeader({
          title,
          onBack: () => this.close(),
          ariaLabel: translateText("common.back"),
          rightContent: isLoggedIn
            ? html`
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs text-blue-400 font-bold uppercase tracking-wider"
                    >${translateText("account_modal.public_player_id")}</span
                  >
                  <copy-button
                    .lobbyId=${publicId}
                    .copyText=${publicId}
                    .displayText=${displayId}
                  ></copy-button>
                </div>
              `
            : undefined,
        })}

        <div class="flex-1 overflow-y-auto custom-scrollbar mr-1">
          ${isLoggedIn ? this.renderAccountInfo() : this.renderLoginOptions()}
        </div>
      </div>
    `;
  }

  private renderAccountInfo() {
    const me = this.userMeResponse?.user;
    const isLinked = me?.discord ?? me?.email;

    if (!isLinked) {
      return this.renderLoginOptions();
    }

    return html`
      <div class="p-6">
        <div class="flex flex-col gap-6">
          <!-- Top Row: Connected As -->
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex flex-col items-center gap-4">
              <div
                class="text-xs text-white/40 uppercase tracking-widest font-bold border-b border-white/5 pb-2 px-8"
              >
                ${translateText("account_modal.connected_as")}
              </div>
              <div class="flex items-center gap-8 justify-center flex-wrap">
                <discord-user-header
                  .data=${this.userMeResponse?.user?.discord ?? null}
                ></discord-user-header>
                ${this.renderLoggedInAs()}
              </div>
            </div>
          </div>

          <!-- Middle Row: Stats Section -->
          ${this.hasAnyStats()
            ? html`<div
                class="bg-white/5 rounded-xl border border-white/10 p-6"
              >
                <h3
                  class="text-lg font-bold text-white mb-4 flex items-center gap-2"
                >
                  <span class="text-blue-400">📊</span>
                  ${translateText("account_modal.stats_overview")}
                </h3>
                <player-stats-tree-view
                  .statsTree=${this.statsTree}
                ></player-stats-tree-view>
              </div>`
            : ""}

          <!-- Bottom Row: Recent Games Section -->
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3
              class="text-lg font-bold text-white mb-4 flex items-center gap-2"
            >
              <span class="text-blue-400">🎮</span>
              ${translateText("game_list.recent_games")}
            </h3>
            <game-list
              .games=${this.recentGames}
              .onViewGame=${(id: string) => void this.viewGame(id)}
            ></game-list>
          </div>
        </div>
      </div>
    `;
  }

  private renderCurrency(): TemplateResult {
    const currency = this.userMeResponse?.player?.currency;
    if (!currency) return html``;

    return html`
      <currency-display
        .hard=${currency.hard}
        .soft=${currency.soft}
      ></currency-display>
    `;
  }

  private renderLoggedInAs(): TemplateResult {
    const me = this.userMeResponse?.user;
    if (me?.discord) {
      return html`
        <div class="flex flex-col items-center gap-3 w-full">
          ${this.renderCurrency()} ${this.renderLogoutButton()}
        </div>
      `;
    } else if (me?.email) {
      return html`
        <div class="flex flex-col items-center gap-3 w-full">
          <div class="text-white text-lg font-medium">
            ${translateText("account_modal.linked_account", {
              account_name: me.email,
            })}
          </div>
          ${this.renderCurrency()} ${this.renderLogoutButton()}
        </div>
      `;
    }
    return html``;
  }

  private async viewGame(gameId: string): Promise<void> {
    this.close();
    const config = await getRuntimeClientServerConfig();
    const encodedGameId = encodeURIComponent(gameId);
    const newUrl = `/${config.workerPath(gameId)}/game/${encodedGameId}`;

    history.pushState({ join: gameId }, "", newUrl);
    window.dispatchEvent(
      new CustomEvent("join-changed", { detail: { gameId: encodedGameId } }),
    );
  }

  private renderLogoutButton(): TemplateResult {
    return html`
      <o-button
        variant="danger"
        size="md"
        translationKey="account_modal.log_out"
        @click=${this.handleLogout}
      ></o-button>
    `;
  }

  private renderLoginOptions() {
    return html`
      <div class="flex items-center justify-center p-6 min-h-full">
        <div
          class="w-full max-w-md bg-white/5 rounded-2xl border border-white/10 p-8"
        >
          <div class="text-center mb-8">
            <div
              class="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </div>
            <p class="text-white/50 text-sm font-medium">
              ${translateText("account_modal.sign_in_desc")}
            </p>
            ${this.renderCurrency()}
          </div>

          <div class="space-y-4">
            <!-- Guest play notice -->
            <div class="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center">
              <p class="text-green-400 text-sm font-bold">✓ Playing as Guest — no login needed</p>
              <p class="text-white/40 text-xs mt-1">All features unlocked. Login is optional.</p>
            </div>

            <!-- Google Sign-in -->
            <button
              @click="${this.handleGoogleLogin}"
              class="w-full px-6 py-4 text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="font-bold tracking-wide">Sign in with Google</span>
            </button>

            <p class="text-center text-white/30 text-xs">
              Login saves your stats across devices. Everything is free with or without an account.
            </p>
          </div>

          <div class="mt-8 text-center border-t border-white/10 pt-6">
            <button
              @click="${this.handleLogout}"
              class="text-[10px] font-bold text-white/20 hover:text-red-400 transition-colors uppercase tracking-widest pb-0.5"
            >
              ${translateText("account_modal.clear_session")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private handleEmailInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.email = target.value;
  }

  private async handleSubmit() {
    if (!this.email) {
      alert(translateText("account_modal.enter_email_address"));
      return;
    }

    const success = await sendMagicLink(this.email);
    if (success) {
      alert(
        translateText("account_modal.recovery_email_sent", {
          email: this.email,
        }),
      );
    } else {
      alert(translateText("account_modal.failed_to_send_recovery_email"));
    }
  }

  private async handleGoogleLogin() {
    if (!isFirebaseConfigured()) {
      alert("Google sign-in is not yet configured for this deployment. Playing as guest is fully supported — no login needed!");
      return;
    }
    const user = await signInWithGoogle();
    if (user) {
      this.close();
      window.location.reload();
    }
  }

  protected onOpen(): void {
    this.isLoadingUser = true;

    void getUserMe()
      .then((userMe) => {
        if (userMe) {
          this.userMeResponse = userMe;
          if (this.userMeResponse?.player?.publicId) {
            this.loadPlayerProfile(this.userMeResponse.player.publicId);
          }
        }
        this.isLoadingUser = false;
        this.requestUpdate();
      })
      .catch((err) => {
        console.warn("Failed to fetch user info in AccountModal.open():", err);
        this.isLoadingUser = false;
        this.requestUpdate();
      });
    this.requestUpdate();
  }

  protected onClose(): void {
    this.dispatchEvent(
      new CustomEvent("close", { bubbles: true, composed: true }),
    );
  }

  private async handleLogout() {
    await logOut();
    this.close();
    // Refresh the page after logout to update the UI state
    window.location.reload();
  }

  private async loadPlayerProfile(publicId: string): Promise<void> {
    try {
      const data = await fetchPlayerById(publicId);
      if (!data) {
        this.requestUpdate();
        return;
      }

      this.recentGames = data.games;
      this.statsTree = data.stats;

      this.requestUpdate();
    } catch (err) {
      console.warn("Failed to load player data:", err);
      this.requestUpdate();
    }
  }
}
