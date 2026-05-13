import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

interface CampaignMission {
  id: number;
  act: number;
  actTitle: string;
  title: string;
  historicalContext: string;
  specialRule: string;
  stars: number;
}

const MISSIONS: CampaignMission[] = [
  {
    id: 1, act: 1, actTitle: "Ancient World",
    title: "Rise of Rome",
    historicalContext: "Start as a tiny village on the Italian peninsula. Unite the tribes and forge an empire that will last a millennium.",
    specialRule: "Win by controlling all of Italy before the timer expires.",
    stars: 0,
  },
  {
    id: 2, act: 1, actTitle: "Ancient World",
    title: "Alexander's March",
    historicalContext: "Begin in Macedonia with the finest army of the ancient world. Reach India before your treasury runs dry.",
    specialRule: "Reach the eastern map edge within 15 minutes.",
    stars: 0,
  },
  {
    id: 3, act: 1, actTitle: "Ancient World",
    title: "The Mongol Tide",
    historicalContext: "The largest cavalry force the world has ever seen. Conquer Asia before the Mongolian winter forces a retreat.",
    specialRule: "Largest starting army. Conquer Asia before the cold season event fires.",
    stars: 0,
  },
  {
    id: 4, act: 2, actTitle: "Medieval Struggle",
    title: "The Crusades",
    historicalContext: "Two worlds collide. Christian kingdoms march east while Muslim forces defend their holy lands. Jerusalem is the prize.",
    specialRule: "Capture Jerusalem to trigger a 3-star bonus. Both factions have powerful starting positions.",
    stars: 0,
  },
  {
    id: 5, act: 2, actTitle: "Medieval Struggle",
    title: "Genghis Khan",
    historicalContext: "The Mongol horde sweeps across the steppe. Every captured city feeds your armies. Leave nothing standing.",
    specialRule: "Special 'Pillage' ability — instantly gain resources from any city you capture.",
    stars: 0,
  },
  {
    id: 6, act: 2, actTitle: "Medieval Struggle",
    title: "The Black Death",
    historicalContext: "Plague ravages Europe. Random tiles become infected and revert to neutral. Survive, and conquer what remains.",
    specialRule: "Random tiles 'die' every 60 seconds. Survive and hold 60% of surviving tiles.",
    stars: 0,
  },
  {
    id: 7, act: 3, actTitle: "Age of Empires",
    title: "Spanish Conquest",
    historicalContext: "Galleons cross the Atlantic. The New World awaits — but its defenders are many, and they fight for their homes.",
    specialRule: "Naval invasion — start at sea, land forces on the American coast.",
    stars: 0,
  },
  {
    id: 8, act: 3, actTitle: "Age of Empires",
    title: "The Dutch Republic",
    historicalContext: "Trade built an empire. Control the sea lanes and the world's wealth flows to Amsterdam.",
    specialRule: "Trade routes are victory points. Hold 5 active trade routes to win.",
    stars: 0,
  },
  {
    id: 9, act: 3, actTitle: "Age of Empires",
    title: "Ottoman Siege",
    historicalContext: "The walls of Constantinople have held for a thousand years. Your cannons will end that legacy.",
    specialRule: "Capture Constantinople with artillery forces before the 10-minute timer expires.",
    stars: 0,
  },
  {
    id: 10, act: 4, actTitle: "World at War",
    title: "WWI Trenches",
    historicalContext: "The Western Front. Miles of fortified trenches, barbed wire, and artillery. Breaking through is the challenge.",
    specialRule: "Both sides start with maximum fortifications. Breakthrough required.",
    stars: 0,
  },
  {
    id: 11, act: 4, actTitle: "World at War",
    title: "Blitzkrieg",
    historicalContext: "Lightning war. Tanks and planes pierce through defensive lines before the enemy can react. Speed is everything.",
    specialRule: "Conquer France in under 5 minutes. Clock is ticking.",
    stars: 0,
  },
  {
    id: 12, act: 4, actTitle: "World at War",
    title: "Pacific Theater",
    historicalContext: "Island after island. The Pacific war is fought on tiny specks of land surrounded by vast ocean. Naval power dominates.",
    specialRule: "Naval combat only between islands. Control 70% of island territory to win.",
    stars: 0,
  },
  {
    id: 13, act: 4, actTitle: "World at War",
    title: "D-Day",
    historicalContext: "Operation Overlord. The largest seaborne invasion in history. The beaches are heavily defended — cross them.",
    specialRule: "Allied forces land on a fortified shore. Establish a beachhead and push inland.",
    stars: 0,
  },
  {
    id: 14, act: 4, actTitle: "World at War",
    title: "Eastern Front",
    historicalContext: "The war's bloodiest theater. Supply lines stretched to breaking. Attrition decides everything.",
    specialRule: "Supply lines critical — units more than 8 hops from capital fight at 50% efficiency.",
    stars: 0,
  },
  {
    id: 15, act: 5, actTitle: "Cold War & Beyond",
    title: "Cuban Missile Crisis",
    historicalContext: "The world holds its breath. Thirteen days that nearly ended civilization. Diplomacy is your only weapon.",
    specialRule: "Win by diplomatic resolution before nuclear war triggers. Every aggressive action raises the escalation meter.",
    stars: 0,
  },
  {
    id: 16, act: 5, actTitle: "Cold War & Beyond",
    title: "Vietnam",
    historicalContext: "Jungle warfare. The enemy fades into the trees and your captured territory keeps reverting. Attrition will break you.",
    specialRule: "Guerrilla AI — captured tiles randomly revert. You must hold 80% for 60 consecutive seconds.",
    stars: 0,
  },
  {
    id: 17, act: 5, actTitle: "Cold War & Beyond",
    title: "Gulf War",
    historicalContext: "Overwhelming modern force against an entrenched defender. Air superiority changes everything.",
    specialRule: "Air power bonus — your units receive +30% attack bonus from air superiority.",
    stars: 0,
  },
  {
    id: 18, act: 5, actTitle: "Cold War & Beyond",
    title: "Cyber Warfare",
    historicalContext: "The new battlefield has no borders. Intelligence and espionage decide the outcome before a single shot is fired.",
    specialRule: "Intel and espionage focused. Recruit agents and steal enemy research to win.",
    stars: 0,
  },
  {
    id: 19, act: 5, actTitle: "Cold War & Beyond",
    title: "Climate Wars 2045",
    historicalContext: "Rising seas swallow coastlines. Resource scarcity drives desperate wars. The world of tomorrow is a brutal place.",
    specialRule: "Flooding — coastal tiles disappear over time. Adapt your strategy as the map shrinks.",
    stars: 0,
  },
  {
    id: 20, act: 5, actTitle: "Cold War & Beyond",
    title: "World Domination",
    historicalContext: "Every system active. The hardest AI. No time limit. Only one empire can rule the world.",
    specialRule: "All systems active. Legendary AI opponents. Conquer 100% of the map.",
    stars: 0,
  },
];

const ACT_COLORS: Record<number, string> = {
  1: "text-amber-400",
  2: "text-purple-400",
  3: "text-blue-400",
  4: "text-red-400",
  5: "text-cyan-400",
};

@customElement("dominion-campaign-screen")
export class CampaignScreen extends LitElement {
  @state() private selectedMission: CampaignMission | null = null;

  createRenderRoot() {
    return this;
  }

  private groupedMissions(): Map<number, CampaignMission[]> {
    const groups = new Map<number, CampaignMission[]>();
    for (const m of MISSIONS) {
      const list = groups.get(m.act) ?? [];
      list.push(m);
      groups.set(m.act, list);
    }
    return groups;
  }

  render() {
    return html`
      <div
        class="flex flex-col h-full bg-dominion-bg-dark text-dominion-text-light"
        role="main"
        aria-label="Campaign mode"
      >
        <header class="border-b border-dominion-border px-6 py-4">
          <h1
            class="font-display text-2xl font-bold uppercase tracking-widest text-malibu-blue"
          >
            Campaign
          </h1>
          <p class="text-sm text-dominion-text-muted">
            20 missions across human history
          </p>
        </header>

        <div class="flex flex-1 overflow-hidden">
          <!-- Mission list -->
          <div class="flex-1 overflow-y-auto p-4 space-y-6">
            ${Array.from(this.groupedMissions().entries()).map(
              ([act, missions]) => html`
                <section>
                  <h2
                    class="mb-3 text-xs font-bold uppercase tracking-widest ${ACT_COLORS[act] ?? "text-dominion-text-muted"}"
                  >
                    Act ${act} — ${missions[0].actTitle}
                  </h2>
                  <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    ${missions.map((m) => this.renderMissionCard(m))}
                  </div>
                </section>
              `,
            )}
          </div>

          <!-- Mission detail -->
          ${this.selectedMission
            ? html`
                <aside
                  class="hidden md:flex w-72 flex-col border-l border-dominion-border p-5 gap-4"
                  aria-label="Mission detail"
                >
                  <h3
                    class="font-bold text-lg text-dominion-text-light leading-tight"
                  >
                    Mission ${this.selectedMission.id}:
                    ${this.selectedMission.title}
                  </h3>
                  <p class="text-sm text-dominion-text-muted leading-relaxed">
                    ${this.selectedMission.historicalContext}
                  </p>
                  <div
                    class="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-400"
                  >
                    <strong>Special Rule:</strong>
                    ${this.selectedMission.specialRule}
                  </div>
                  <div class="flex gap-1" aria-label="Mission stars">
                    ${[1, 2, 3].map(
                      (i) => html`
                        <span
                          class="text-xl ${i <= this.selectedMission!.stars
                            ? "text-amber-400"
                            : "text-dominion-border"}"
                          aria-label="${i <= this.selectedMission!.stars
                            ? "Star earned"
                            : "Star not earned"}"
                        >
                          ★
                        </span>
                      `,
                    )}
                  </div>
                  <button
                    class="mt-auto rounded border border-malibu-blue bg-malibu-blue/10 px-4 py-2 text-sm font-bold text-malibu-blue hover:bg-malibu-blue hover:text-dominion-bg-dark focus:outline-none focus:ring transition-colors"
                    aria-label="Start mission ${this.selectedMission.id}"
                    @click=${() =>
                      this.dispatchEvent(
                        new CustomEvent("start-mission", {
                          detail: this.selectedMission,
                          bubbles: true,
                        }),
                      )}
                  >
                    Start Mission →
                  </button>
                </aside>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private renderMissionCard(m: CampaignMission) {
    const isSelected = this.selectedMission?.id === m.id;
    return html`
      <button
        role="option"
        aria-selected=${isSelected}
        aria-label="Mission ${m.id}: ${m.title}"
        class=${`flex flex-col gap-1 rounded border p-3 text-left transition-all focus:outline-none focus:ring
          ${isSelected ? "border-malibu-blue bg-malibu-blue/10" : "border-dominion-border hover:border-white/30 hover:bg-white/5"}`}
        @click=${() => {
          this.selectedMission = m;
        }}
      >
        <span class="text-xs text-dominion-text-muted">
          Mission ${m.id}
        </span>
        <span class="text-sm font-bold text-dominion-text-light">
          ${m.title}
        </span>
        <div class="flex gap-0.5 mt-1">
          ${[1, 2, 3].map(
            (i) => html`
              <span
                class="text-sm ${i <= m.stars ? "text-amber-400" : "text-dominion-border"}"
              >★</span>
            `,
          )}
        </div>
      </button>
    `;
  }
}
