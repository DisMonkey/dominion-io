import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { EventBus } from "../../core/EventBus";
import { GameView } from "../../core/game/GameView";
import {
  ActiveResearch,
  Tech,
  TechDefinition,
  TechDefinitions,
  canResearchTech,
} from "../../core/TechTree";
import { SendResearchIntentEvent, ToggleTechPanelEvent } from "../Transport";

const BRANCHES: { label: string; techs: Tech[] }[] = [
  {
    label: "Military",
    techs: [
      Tech.ImprovedLogistics,
      Tech.ArmoredDivision,
      Tech.ArtilleryCorps,
      Tech.AirSuperiority,
    ],
  },
  {
    label: "Industrial",
    techs: [Tech.NavalDominance, Tech.SteelFortress, Tech.NuclearProgram],
  },
  {
    label: "Intelligence",
    techs: [Tech.IntelligenceNetwork],
  },
];

function fmtCost(n: bigint): string {
  if (n >= 1_000_000n) return `${(Number(n) / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000n) return `${(Number(n) / 1_000).toFixed(0)}K`;
  return String(n);
}

@customElement("dominion-tech-panel")
export class TechPanel extends LitElement {
  @property({ attribute: false }) eventBus: EventBus | null = null;
  @property({ attribute: false }) game: GameView | null = null;

  @state() private visible = false;
  @state() private completedTechs = new Set<Tech>();
  @state() private activeResearch: ActiveResearch | null = null;
  @state() private nowTick = 0;

  private _interval: ReturnType<typeof setInterval> | null = null;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this._interval = setInterval(() => {
      if (!this.game) return;
      const tick = this.game.ticks();
      this.nowTick = tick;
      if (
        this.activeResearch !== null &&
        tick >= this.activeResearch.completesAt
      ) {
        this.completedTechs = new Set([
          ...this.completedTechs,
          this.activeResearch.tech,
        ]);
        this.activeResearch = null;
        this.requestUpdate();
      }
    }, 200);
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
    this.eventBus.on(ToggleTechPanelEvent, () => {
      this.visible = !this.visible;
      this.requestUpdate();
    });
  }

  private canResearch(tech: Tech): boolean {
    return canResearchTech(this.completedTechs, this.activeResearch, tech);
  }

  private startResearch(tech: Tech) {
    if (!this.canResearch(tech)) return;
    this.eventBus?.emit(new SendResearchIntentEvent(tech));
    const def = TechDefinitions[tech];
    this.activeResearch = {
      tech,
      startedAt: this.nowTick,
      completesAt: this.nowTick + def.durationTicks,
    };
    this.requestUpdate();
  }

  private researchProgress(): number {
    if (!this.activeResearch) return 0;
    const { startedAt, completesAt } = this.activeResearch;
    const total = completesAt - startedAt;
    if (total <= 0) return 1;
    return Math.min(1, Math.max(0, (this.nowTick - startedAt) / total));
  }

  private renderTech(def: TechDefinition) {
    const tech = def.tech;
    const isDone = this.completedTechs.has(tech);
    const isActive = this.activeResearch?.tech === tech;
    const canStart = this.canResearch(tech);
    const prereqsMet = def.prerequisites.every((p) =>
      this.completedTechs.has(p),
    );

    let border = "border-white/10";
    let nameClass = prereqsMet ? "text-white/60" : "text-white/20";
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

    const tooltip = isDone
      ? "Completed"
      : isActive
        ? "In progress"
        : canStart
          ? "Click to research"
          : `Requires: ${def.prerequisites.join(", ") || "none"}`;

    return html`
      <div
        class="rounded border ${border} p-2 transition-colors select-none ${canStart ? "cursor-pointer hover:bg-white/5" : ""}"
        title=${tooltip}
        @click=${canStart ? () => this.startResearch(tech) : null}
      >
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-semibold ${nameClass} capitalize leading-tight"
            >${tech.replace(/_/g, " ")}</span
          >
          ${isDone
            ? html`<span class="text-[9px] text-yellow-400 font-bold">✓</span>`
            : isActive
              ? html`<span class="text-[9px] text-cyan-400"
                    >${Math.round(this.researchProgress() * 100)}%</span
                  >`
              : html``}
        </div>
        <div class="text-[10px] text-white/40 leading-tight mt-0.5">
          ${def.description}
        </div>
        ${!isDone && !isActive
          ? html`<div class="text-[9px] text-white/25 mt-0.5">
              ${fmtCost(def.cost)} gold · ${def.durationTicks}t
            </div>`
          : html``}
        ${isActive
          ? html`<div
              class="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5"
            >
              <div
                class="h-full bg-cyan-400 transition-[width] duration-200"
                style="width:${(this.researchProgress() * 100).toFixed(1)}%"
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
        class="fixed left-0 top-0 min-[1200px]:top-4 min-[1200px]:left-[200px] z-[850] w-64 max-h-[calc(100vh-120px)] overflow-y-auto rounded-r-lg min-[1200px]:rounded-lg bg-gray-800/95 backdrop-blur-sm border border-white/10 shadow-xl text-white flex flex-col pointer-events-auto"
      >
        <div
          class="flex items-center justify-between px-3 py-2 border-b border-white/10 shrink-0"
        >
          <span class="text-xs font-bold uppercase tracking-wider text-cyan-400"
            >🔬 Tech Tree</span
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

        ${this.activeResearch
          ? html`<div
              class="mx-3 mt-2 px-2 py-1.5 rounded bg-cyan-400/10 border border-cyan-400/30 text-xs shrink-0"
            >
              <div class="flex justify-between mb-1">
                <span class="font-bold text-cyan-300 capitalize"
                  >Researching: ${this.activeResearch.tech.replace(/_/g, " ")}</span
                >
                <span class="text-white/50"
                  >${Math.round(this.researchProgress() * 100)}%</span
                >
              </div>
              <div
                class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-cyan-400 transition-[width] duration-300"
                  style="width:${(this.researchProgress() * 100).toFixed(1)}%"
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
                  ${branch.techs.map((t) => this.renderTech(TechDefinitions[t]))}
                </div>
              </div>
            `,
          )}
        </div>
      </aside>
    `;
  }
}
