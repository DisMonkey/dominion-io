import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("dominion-settings-panel")
export class SettingsPanel extends LitElement {
  @state() private masterVolume = 70;
  @state() private musicVolume = 25;
  @state() private sfxVolume = 80;
  @state() private particleEffects: "off" | "low" | "high" = "high";
  @state() private renderQuality: "low" | "medium" | "high" | "ultra" =
    "medium";
  @state() private dayNightCycle = true;
  @state() private weatherEffects = true;
  @state() private animatedBorders = true;
  @state() private captureAnimations = true;
  @state() private uiSounds = true;
  @state() private ambientSounds = true;
  @state() private muteWhenHidden = true;
  @state() private showDamageNumbers = true;
  @state() private showSupplyLines = false;
  @state() private showAirOverlay = false;
  @state() private reducedMotion = false;
  @state() private colorBlindMode: "none" | "deuteranopia" | "protanopia" | "high-contrast" = "none";
  @state() private fontScale = 100;

  createRenderRoot() {
    return this;
  }

  private toggle(
    key: string,
    value: boolean,
  ) {
    (this as unknown as Record<string, boolean>)[key] = value;
    this.requestUpdate();
    this.save();
  }

  private save() {
    const data = {
      masterVolume: this.masterVolume,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      particleEffects: this.particleEffects,
      renderQuality: this.renderQuality,
      dayNightCycle: this.dayNightCycle,
      weatherEffects: this.weatherEffects,
      animatedBorders: this.animatedBorders,
      captureAnimations: this.captureAnimations,
      uiSounds: this.uiSounds,
      ambientSounds: this.ambientSounds,
      muteWhenHidden: this.muteWhenHidden,
      showDamageNumbers: this.showDamageNumbers,
      showSupplyLines: this.showSupplyLines,
      showAirOverlay: this.showAirOverlay,
      reducedMotion: this.reducedMotion,
      colorBlindMode: this.colorBlindMode,
      fontScale: this.fontScale,
    };
    try {
      localStorage.setItem("dominion_settings", JSON.stringify(data));
    } catch {
      // storage unavailable
    }
  }

  connectedCallback() {
    super.connectedCallback();
    try {
      const raw = localStorage.getItem("dominion_settings");
      if (raw) {
        const saved = JSON.parse(raw) as Partial<typeof this>;
        Object.assign(this, saved);
      }
    } catch {
      // use defaults
    }
  }

  render() {
    return html`
      <form
        class="space-y-8 rounded border border-dominion-border bg-dominion-bg-panel p-5 text-dominion-text-light"
        aria-label="Settings"
        @submit=${(e: Event) => e.preventDefault()}
      >
        <!-- Graphics -->
        <fieldset class="space-y-3">
          <legend class="font-bold uppercase tracking-widest text-malibu-blue text-sm">
            Graphics
          </legend>
          ${this.renderSelect(
            "Render Quality",
            "render-quality",
            this.renderQuality,
            ["low", "medium", "high", "ultra"],
            ["Low", "Medium", "High", "Ultra"],
            (v) => {
              this.renderQuality = v as typeof this.renderQuality;
              this.save();
            },
          )}
          ${this.renderSelect(
            "Particle Effects",
            "particle-effects",
            this.particleEffects,
            ["off", "low", "high"],
            ["Off", "Low", "High"],
            (v) => {
              this.particleEffects = v as typeof this.particleEffects;
              this.save();
            },
          )}
          ${this.renderToggle("Day/Night Cycle", "day-night", this.dayNightCycle, (v) =>
            this.toggle("dayNightCycle", v),
          )}
          ${this.renderToggle("Weather Effects", "weather", this.weatherEffects, (v) =>
            this.toggle("weatherEffects", v),
          )}
          ${this.renderToggle(
            "Animated Borders",
            "animated-borders",
            this.animatedBorders,
            (v) => this.toggle("animatedBorders", v),
          )}
          ${this.renderToggle(
            "Territory Capture Animations",
            "capture-anim",
            this.captureAnimations,
            (v) => this.toggle("captureAnimations", v),
          )}
        </fieldset>

        <!-- Audio -->
        <fieldset class="space-y-3">
          <legend class="font-bold uppercase tracking-widest text-malibu-blue text-sm">
            Audio
          </legend>
          ${this.renderSlider("Master Volume", "master-vol", this.masterVolume, (v) => {
            this.masterVolume = v;
            this.save();
          })}
          ${this.renderSlider("Music Volume", "music-vol", this.musicVolume, (v) => {
            this.musicVolume = v;
            this.save();
          })}
          ${this.renderSlider("SFX Volume", "sfx-vol", this.sfxVolume, (v) => {
            this.sfxVolume = v;
            this.save();
          })}
          ${this.renderToggle("UI Sounds", "ui-sounds", this.uiSounds, (v) =>
            this.toggle("uiSounds", v),
          )}
          ${this.renderToggle("Ambient Sounds", "ambient", this.ambientSounds, (v) =>
            this.toggle("ambientSounds", v),
          )}
          ${this.renderToggle(
            "Mute when tab is hidden",
            "mute-hidden",
            this.muteWhenHidden,
            (v) => this.toggle("muteWhenHidden", v),
          )}
        </fieldset>

        <!-- Gameplay -->
        <fieldset class="space-y-3">
          <legend class="font-bold uppercase tracking-widest text-malibu-blue text-sm">
            Gameplay
          </legend>
          ${this.renderToggle("Damage Numbers", "dmg-numbers", this.showDamageNumbers, (v) =>
            this.toggle("showDamageNumbers", v),
          )}
          ${this.renderToggle("Supply Line Overlay", "supply-overlay", this.showSupplyLines, (v) =>
            this.toggle("showSupplyLines", v),
          )}
          ${this.renderToggle("Air Mission Overlay", "air-overlay", this.showAirOverlay, (v) =>
            this.toggle("showAirOverlay", v),
          )}
          ${this.renderToggle("Reduced Motion", "reduced-motion", this.reducedMotion, (v) =>
            this.toggle("reducedMotion", v),
          )}
        </fieldset>

        <!-- Accessibility -->
        <fieldset class="space-y-3">
          <legend class="font-bold uppercase tracking-widest text-malibu-blue text-sm">
            Accessibility
          </legend>
          ${this.renderSelect(
            "Color Blind Mode",
            "color-blind",
            this.colorBlindMode,
            ["none", "deuteranopia", "protanopia", "high-contrast"],
            ["None", "Deuteranopia", "Protanopia", "High Contrast"],
            (v) => {
              this.colorBlindMode = v as typeof this.colorBlindMode;
              this.save();
            },
          )}
          ${this.renderSlider("Font Size", "font-scale", this.fontScale, (v) => {
            this.fontScale = v;
            this.save();
          }, 80, 130)}
        </fieldset>
      </form>
    `;
  }

  private renderToggle(
    label: string,
    id: string,
    checked: boolean,
    onChange: (v: boolean) => void,
  ) {
    return html`
      <label
        class="flex items-center justify-between gap-4 cursor-pointer"
        for=${id}
      >
        <span class="text-sm text-dominion-text-light">${label}</span>
        <input
          type="checkbox"
          id=${id}
          .checked=${checked}
          class="h-4 w-4 accent-malibu-blue cursor-pointer"
          aria-label=${label}
          @change=${(e: Event) =>
            onChange((e.target as HTMLInputElement).checked)}
        />
      </label>
    `;
  }

  private renderSlider(
    label: string,
    id: string,
    value: number,
    onChange: (v: number) => void,
    min = 0,
    max = 100,
  ) {
    return html`
      <div class="space-y-1">
        <div class="flex items-center justify-between text-sm">
          <label for=${id} class="text-dominion-text-light">${label}</label>
          <span class="tabular-nums text-dominion-text-muted">${value}</span>
        </div>
        <input
          type="range"
          id=${id}
          min=${min}
          max=${max}
          .value=${value.toString()}
          class="w-full accent-malibu-blue cursor-pointer"
          aria-label=${label}
          @input=${(e: Event) =>
            onChange(parseInt((e.target as HTMLInputElement).value, 10))}
        />
      </div>
    `;
  }

  private renderSelect(
    label: string,
    id: string,
    value: string,
    values: string[],
    labels: string[],
    onChange: (v: string) => void,
  ) {
    return html`
      <div class="flex items-center justify-between gap-4">
        <label for=${id} class="text-sm text-dominion-text-light">${label}</label>
        <select
          id=${id}
          class="rounded border border-dominion-border bg-dominion-bg-dark px-2 py-1 text-sm text-dominion-text-light focus:border-malibu-blue focus:outline-none"
          aria-label=${label}
          .value=${value}
          @change=${(e: Event) =>
            onChange((e.target as HTMLSelectElement).value)}
        >
          ${values.map(
            (v, i) =>
              html`<option value=${v} ?selected=${v === value}>
                ${labels[i]}
              </option>`,
          )}
        </select>
      </div>
    `;
  }
}
