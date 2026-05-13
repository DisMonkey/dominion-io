import { PlayerID } from "./game/Game";

export enum Ideology {
  Democratic = "democratic",
  Fascist = "fascist",
  Communist = "communist",
  Neutral = "neutral",
}

export enum PoliticalAction {
  StartNationalFocus = "start_national_focus",
  EmergencyDecree = "emergency_decree",
  GovernmentInExile = "government_in_exile",
  DemandSurrender = "demand_surrender",
  DeclareIdeology = "declare_ideology",
}

export interface PoliticalProfile {
  playerId: PlayerID;
  politicalPower: bigint;
  ideology: Ideology;
}

export const PoliticalActionCosts = {
  [PoliticalAction.StartNationalFocus]: 25n,
  [PoliticalAction.EmergencyDecree]: 50n,
  [PoliticalAction.GovernmentInExile]: 75n,
  [PoliticalAction.DemandSurrender]: 100n,
  [PoliticalAction.DeclareIdeology]: 0n,
} as const satisfies Record<PoliticalAction, bigint>;

export function politicalPowerAtTick(
  previous: bigint,
  elapsedTicks: number,
): bigint {
  return previous + BigInt(Math.floor(elapsedTicks / 5));
}

export function ideologyAllianceModifier(
  self: Ideology,
  other: Ideology,
): { ceasefireCostMultiplier: number; adjacentDefenseBonus: number } {
  if (self !== Ideology.Neutral && self === other) {
    return { ceasefireCostMultiplier: 0.85, adjacentDefenseBonus: 0.1 };
  }
  return { ceasefireCostMultiplier: 1, adjacentDefenseBonus: 0 };
}
