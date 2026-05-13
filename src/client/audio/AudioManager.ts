export enum DominionSound {
  TerritoryCapture = "territory_capture",
  NukeLaunch = "nuke_launch",
  AllianceFormed = "alliance_formed",
  WarDeclared = "war_declared",
  TechResearched = "tech_researched",
  AbilityActivated = "ability_activated",
}

export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
}

export class AudioManager {
  private context: AudioContext | null = null;
  private settings: AudioSettings = {
    masterVolume: 0.7,
    sfxVolume: 0.8,
    musicVolume: 0.25,
  };
  private musicOscillators: OscillatorNode[] = [];

  setSettings(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  async resume(): Promise<void> {
    const context = this.ensureContext();
    if (context.state === "suspended") {
      await context.resume();
    }
  }

  play(sound: DominionSound): void {
    const context = this.ensureContext();
    const now = context.currentTime;
    switch (sound) {
      case DominionSound.TerritoryCapture:
        this.playDrumHit(now, 140, 0.12);
        break;
      case DominionSound.NukeLaunch:
        this.playRumble(now);
        break;
      case DominionSound.AllianceFormed:
        this.playChord(now, [261.63, 329.63, 392], 0.35);
        break;
      case DominionSound.WarDeclared:
        this.playChord(now, [196, 207.65, 233.08], 0.45);
        break;
      case DominionSound.TechResearched:
        this.playChord(now, [523.25, 659.25, 783.99], 0.25);
        break;
      case DominionSound.AbilityActivated:
        this.playBeep(now, 880, 0.08);
        this.playBeep(now + 0.1, 1174.66, 0.08);
        break;
    }
  }

  startMusic(): void {
    if (this.musicOscillators.length > 0) return;
    const context = this.ensureContext();
    const gain = context.createGain();
    gain.gain.value = this.settings.masterVolume * this.settings.musicVolume;
    gain.connect(context.destination);
    for (const frequency of [55, 82.41, 110]) {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      oscillator.start();
      this.musicOscillators.push(oscillator);
    }
  }

  stopMusic(): void {
    for (const oscillator of this.musicOscillators) {
      oscillator.stop();
    }
    this.musicOscillators = [];
  }

  private ensureContext(): AudioContext {
    this.context ??= new AudioContext();
    return this.context;
  }

  private playDrumHit(
    start: number,
    frequency: number,
    duration: number,
  ): void {
    const context = this.ensureContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(55, start + duration);
    gain.gain.setValueAtTime(this.sfxGain(), start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  private playRumble(start: number): void {
    this.playDrumHit(start, 90, 1.2);
    this.playDrumHit(start + 0.25, 42, 1.4);
  }

  private playChord(
    start: number,
    frequencies: number[],
    duration: number,
  ): void {
    for (const frequency of frequencies) {
      this.playBeep(start, frequency, duration);
    }
  }

  private playBeep(start: number, frequency: number, duration: number): void {
    const context = this.ensureContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(this.sfxGain(), start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  private sfxGain(): number {
    return this.settings.masterVolume * this.settings.sfxVolume;
  }
}
