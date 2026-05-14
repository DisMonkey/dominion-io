import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { EventBus } from "../../core/EventBus";
import {
  NationalFocus,
  NationalFocusDefinition,
  NationalFocusDefinitions,
} from "../../core/NationalFocus";
import { ToggleFocusPanelEvent } from "../Transport";

const BRANCHES: { label: string; focuses: NationalFocus[] }[] = [
  {
    label: "Military",
    focuses: [
      NationalFocus.MilitaryExpansion,
      NationalFocus.ArmedForcesAct,
      NationalFocus.EliteForces,
      NationalFocus.BlitzkriegDoctrine,
    ],
  },
  {
    label: "Industrial",
    focuses: [
      NationalFocus.FiveYearPlan,
      NationalFocus.WarEconomy,
      NationalFocus.SyntheticFuel,
    ],
  },
  {
    label: "Diplomatic",
    focuses: [
      NationalFocus.GreatPowerStatus,
      NationalFocus.NonAggressionPact,
      NationalFocus.CoalitionBuilder,
    ],
  },
  {
    label: "Political",
    focuses: [
      NationalFocus.TotalMobilization,
      NationalFocus.PropagandaMinistry,
      NationalFocus.SecretPolice,
    ],
  },
];

@customElement("dominion-national-focus-panel")
export class NationalFocusPanel extends LitElement {
  @property({ attribute: false }) eventBus: EventBus | null = null;

  @state() private visible = false;
  @state() private activeFocus: NationalFocus | null = null;
  @state() private completedFocuses = new Set<NationalFocus>();
  @state() private focusStartTick = 0;
  @state() private nowTick = 0;

  private _interval: ReturnType<typeof setInterval> | null = null;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this._interval = setInterval(() => {
      this.nowTick++;
      if (this.activeFocus !== null) {
        const def = NationalFocusDefinitions[this.activeFocus];
        if (this.nowTick - this.focusStartTick >= def.durationTicks) {
          this.completedFocuses = new Set([
            ...this.completedFocuses,
            this.activeFocus,
          ]);
          this.activeFocus = null;
          this.requestUpdate();
        }
      }
    }, 100);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  init() {
    if (!this.eventBus) return;
    this.eventBus.on(ToggleFocusPanelEvent, () => {
      this.visible = !this.visible;
      this.requestUpdate();
    });
  }

  private prereqsMet(def: NationalFocusDefinition): boolean {
    return def.prerequisites.every((p) => this.completedFocuses.has(p));
  }

  private canActivate(focus: NationalFocus): boolean {
    if (this.activeFocus !== null) return false;
    if (this.completedFocuses.has(focus)) return false;
    return this.prereqsMet(NationalFocusDefinitions[focus]);
  }

  private startFocus(focus: NationalFocus) {
    if (!this.canActivate(focus)) return;
    this.activeFocus = focus;
    this.focusStartTick = this.nowTick;
    this.requestUpdate();
  }

  private focusProgress(): number {
    if (!this.activeFocus) return 0;
    const def = NationalFocusDefinitions[this.activeFocus];
    return Math.min(
      1,
      Math.max(0, (this.nowTick - this.focusStartTick) / def.durationTicks),
    );
  }

  private renderFocus(focus: NationalFocus) {
    const def = NationalFocusDefinitions[focus];
    const isDone = this.completedFocuses.has(focus);
    const isActive = this.activeFocus === focus;
    const canStart = this.canActivate(focus);
    const prereqOk = this.prereqsMet(def);
    let border = "border-white/10";
    let nameClass = prereqOk ? "text-white/60" : "text-white/20";
    if (isDone) {
      border = "border-yellow-400/50";
      nameClass = "text-yellow-300";
    } else if (isActive) {
      border = "border-cyan-400/60 animate-pulse";
      nameClass = "text-cyan-300";
    } else if (canStart) {
      border = "border-white/25 hover:border-cyan-400/40";
      nameClass = "text-white";
    }

    return html`
      <div
        class="rounded border ${border} p-2 transition-colors ${canStart ? "cursor-pointer hover:bg-white/5 select-none" : ""}"
        title=${canStart
          ? "Click to activate"
          : isDone
            ? "Completed"
            : isActive
              ? "In progress"
              : `Requires: ${def.prerequisites.join(", ") || "none"}`}
        @click=${canStart ? () => this.startFocus(focus) : null}
      >
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold ${nameClass} capitalize leading-tight"
            >${focus.replace(/_/g, " ")}</span
          >
          ${isDone
            ? html`<span class="text-[9px] text-yellow-400 font-bold">✓</span>`
            : isActive
              ? html`<span class="text-[9px] text-cyan-400"
                    >${Math.round(this.focusProgress() * 100)}%</span
                  >`
              : html``}
        </div>
        <div class="text-[10px] text-white/40 leading-tight mt-0.5">
          ${def.effect}
        </div>
        ${!isDone && !isActive
          ? html`<div class="text-[9px] text-white/25 mt-0.5">
              ${def.durationTicks} ticks
            </div>`
          : html``}
        ${isActive
          ? html`<div
              class="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5"
            >
              <div
                class="h-full bg-cyan-400 transition-[width] duration-200"
                style="width:${(this.focusProgress() * 100).toFixed(1)}%"
              ></div>
            </div>`
          : html``}
      </div>
    `;
  }

  render() {
    if (!this.visible) return html``;

    return html`
      <aside
        class="fixed right-0 top-0 min-[1200px]:top-4 min-[1200px]:right-[180px] z-[850] w-64 max-h-[calc(100vh-120px)] overflow-y-auto rounded-l-lg min-[1200px]:rounded-lg bg-gray-800/95 backdrop-blur-sm border border-white/10 shadow-xl text-white flex flex-col pointer-events-auto"
      >
        <div
          class="flex items-center justify-between px-3 py-2 border-b border-white/10 shrink-0"
        >
          <span
            class="text-xs font-bold uppercase tracking-wider text-amber-400"
            >🎯 National Focus</span
          >
          <button
            class="text-white/40 hover:text-white leading-none text-base"
            @click=${() => {
              this.visible = false;
            }}
          >
            ✕
          </button>
        </div>

        ${this.activeFocus
          ? html`<div
              class="mx-3 mt-2 px-2 py-1.5 rounded bg-amber-400/10 border border-amber-400/30 text-xs shrink-0"
            >
              <div class="flex justify-between mb-1">
                <span class="font-bold text-amber-300 capitalize"
                  >Active: ${this.activeFocus.replace(/_/g, " ")}</span
                >
                <span class="text-white/50"
                  >${Math.round(this.focusProgress() * 100)}%</span
                >
              </div>
              <div
                class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-amber-400 transition-[width] duration-300"
                  style="width:${(this.focusProgress() * 100).toFixed(1)}%"
                ></div>
              </div>
            </div>`
          : html``}

        <div class="flex flex-col gap-3 p-3">
          ${BRANCHES.map(
            (branch) => html`
              <div>
                <div
                  class="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1"
                >
                  ${branch.label}
                </div>
                <div class="flex flex-col gap-1">
                  ${branch.focuses.map((f) => this.renderFocus(f))}
                </div>
              </div>
            `,
          )}
        </div>
      </aside>
    `;
  }
}
