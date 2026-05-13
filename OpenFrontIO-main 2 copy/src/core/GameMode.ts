import { GameMapType } from "./game/Game";

export enum DominionGameMode {
  ClassicConquest = "classic_conquest",
  TeamDomination = "team_domination",
  Blitz = "blitz",
  ColdWar = "cold_war",
}

export interface GameModeDefinition {
  mode: DominionGameMode;
  title: string;
  winCondition: string;
  maxDurationTicks?: number;
  resourceMultiplier: number;
  unitSpeedMultiplier: number;
  allowedMaps?: readonly GameMapType[];
}

export const DominionGameModeDefinitions = {
  [DominionGameMode.ClassicConquest]: {
    mode: DominionGameMode.ClassicConquest,
    title: "Classic Conquest",
    winCondition: "Control 80% of the map",
    resourceMultiplier: 1,
    unitSpeedMultiplier: 1,
  },
  [DominionGameMode.TeamDomination]: {
    mode: DominionGameMode.TeamDomination,
    title: "Team Domination",
    winCondition: "Your team controls 70% of the map",
    resourceMultiplier: 1,
    unitSpeedMultiplier: 1,
  },
  [DominionGameMode.Blitz]: {
    mode: DominionGameMode.Blitz,
    title: "Blitz",
    winCondition: "Most territory when the timer expires",
    maxDurationTicks: 3000,
    resourceMultiplier: 3,
    unitSpeedMultiplier: 1.5,
    allowedMaps: [
      GameMapType.Britannia,
      GameMapType.BritanniaClassic,
      GameMapType.Japan,
      GameMapType.Iceland,
      GameMapType.FourIslands,
    ],
  },
  [DominionGameMode.ColdWar]: {
    mode: DominionGameMode.ColdWar,
    title: "Cold War",
    winCondition: "Eliminate the rival faction or lead when detente expires",
    resourceMultiplier: 1,
    unitSpeedMultiplier: 1,
  },
} as const satisfies Record<DominionGameMode, GameModeDefinition>;
