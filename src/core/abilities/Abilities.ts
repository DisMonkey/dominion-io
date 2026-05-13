import { ResourceType } from "../Economy";
import { TileRef } from "../game/GameMap";

export enum AbilityType {
  Blitz = "blitz",
  Fortify = "fortify",
  AirStrike = "air_strike",
  Propaganda = "propaganda",
  Spy = "spy",
}

export interface AbilityDefinition {
  type: AbilityType;
  cooldownTicks: number;
  durationTicks: number;
  cost: {
    resource: ResourceType;
    amount: bigint;
  };
}

export interface AbilityActivation {
  type: AbilityType;
  sourcePlayerId: string;
  targetTile?: TileRef;
  targetPlayerId?: string;
  activatedAt: number;
}

export const AbilityDefinitions = {
  [AbilityType.Blitz]: {
    type: AbilityType.Blitz,
    cooldownTicks: 1800,
    durationTicks: 150,
    cost: { resource: ResourceType.Gold, amount: 500n },
  },
  [AbilityType.Fortify]: {
    type: AbilityType.Fortify,
    cooldownTicks: 1200,
    durationTicks: 300,
    cost: { resource: ResourceType.Gold, amount: 300n },
  },
  [AbilityType.AirStrike]: {
    type: AbilityType.AirStrike,
    cooldownTicks: 2400,
    durationTicks: 1,
    cost: { resource: ResourceType.Gold, amount: 800n },
  },
  [AbilityType.Propaganda]: {
    type: AbilityType.Propaganda,
    cooldownTicks: 3000,
    durationTicks: 1,
    cost: { resource: ResourceType.Gold, amount: 1000n },
  },
  [AbilityType.Spy]: {
    type: AbilityType.Spy,
    cooldownTicks: 3600,
    durationTicks: 600,
    cost: { resource: ResourceType.Gold, amount: 400n },
  },
} as const satisfies Record<AbilityType, AbilityDefinition>;
