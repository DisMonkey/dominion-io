import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

const QUOTES: { text: string; author: string }[] = [
  { text: "An army marches on its stomach.", author: "Napoleon Bonaparte" },
  {
    text: "In war, the moral is to the physical as three is to one.",
    author: "Napoleon Bonaparte",
  },
  {
    text: "The supreme art of war is to subdue the enemy without fighting.",
    author: "Sun Tzu",
  },
  {
    text: "History is written by the victors.",
    author: "Winston Churchill",
  },
  {
    text: "No plan survives contact with the enemy.",
    author: "Helmuth von Moltke",
  },
  {
    text: "God is not on the side of the big battalions, but on the side of those who shoot best.",
    author: "Voltaire",
  },
  {
    text: "Amateurs think about tactics. Professionals think about logistics.",
    author: "Omar Bradley",
  },
  {
    text: "It is well that war is so terrible, or we should grow too fond of it.",
    author: "Robert E. Lee",
  },
  {
    text: "In preparing for battle I have always found that plans are useless, but planning is indispensable.",
    author: "Dwight D. Eisenhower",
  },
  {
    text: "Never interrupt your enemy when he is making a mistake.",
    author: "Napoleon Bonaparte",
  },
  {
    text: "The object of war is not to die for your country but to make the other bastard die for his.",
    author: "George S. Patton",
  },
  {
    text: "Wars may be fought with weapons, but they are won by men.",
    author: "George S. Patton",
  },
  {
    text: "I have not yet begun to fight.",
    author: "John Paul Jones",
  },
  {
    text: "All warfare is based on deception.",
    author: "Sun Tzu",
  },
  {
    text: "To be prepared for war is one of the most effective means of preserving peace.",
    author: "George Washington",
  },
  {
    text: "The first casualty of war is truth.",
    author: "Hiram W. Johnson",
  },
  {
    text: "There is no avoiding war; it can only be postponed to the advantage of others.",
    author: "Niccolò Machiavelli",
  },
  {
    text: "Know thy self, know thy enemy. A thousand battles, a thousand victories.",
    author: "Sun Tzu",
  },
  {
    text: "Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat.",
    author: "Sun Tzu",
  },
  {
    text: "Every battle is won before it is fought.",
    author: "Sun Tzu",
  },
];

@customElement("dominion-loading-screen")
export class LoadingScreen extends LitElement {
  @property({ type: Number }) progress = 0;
  @state() private quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div
        class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dominion-bg-dark text-dominion-text-light"
        aria-live="polite"
        aria-label="Loading Dominion.io"
      >
        <!-- Scanlines -->
        <div
          class="pointer-events-none absolute inset-0 opacity-5"
          style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)"
        ></div>

        <div class="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-lg">
          <!-- Logo -->
          <div
            class="text-5xl font-black uppercase tracking-[0.3em] text-amber-400"
            style="text-shadow: 0 0 40px rgba(200,151,58,0.6)"
          >
            DOMINION
          </div>

          <!-- Quote -->
          <div class="space-y-1">
            <p
              class="text-sm italic text-dominion-text-muted leading-relaxed"
            >
              "${this.quote.text}"
            </p>
            <p class="text-xs text-dominion-text-muted/60">
              — ${this.quote.author}
            </p>
          </div>

          <!-- Progress bar -->
          <div class="w-64">
            <div
              class="h-1 w-full rounded-full bg-dominion-border overflow-hidden"
              role="progressbar"
              aria-valuenow=${this.progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="h-full rounded-full bg-amber-400 transition-all duration-300"
                style="width: ${Math.min(100, this.progress)}%"
              ></div>
            </div>
            <p class="mt-2 text-xs text-dominion-text-muted uppercase tracking-widest">
              Loading…
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
