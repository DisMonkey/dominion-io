import { AirMission, AirWing } from "./entities/AirUnit";
import { PlayerID } from "./game/Game";
import { TileRef } from "./game/GameMap";

export const AIR_WING_PRODUCTION_COST = 1000n;
export const AIR_MISSION_DAY_TICKS = 100;

export function assignAirMission(
  wing: AirWing,
  mission: AirMission,
  centerTile: TileRef,
  tick: number,
): AirWing {
  return {
    ...wing,
    mission,
    centerTile,
    assignedAtTick: tick,
  };
}

export function airSuperiorityScore(
  wings: readonly AirWing[],
  playerId: PlayerID,
): number {
  return wings.filter(
    (wing) =>
      wing.owner === playerId && wing.mission === AirMission.AirSuperiority,
  ).length;
}

export function contestedAirEffectiveness(
  wings: readonly AirWing[],
  attacker: PlayerID,
  defender: PlayerID,
): number {
  const attackerScore = airSuperiorityScore(wings, attacker);
  const defenderScore = airSuperiorityScore(wings, defender);
  if (attackerScore === defenderScore) return 0.5;
  return attackerScore > defenderScore ? 1 : 0;
}
