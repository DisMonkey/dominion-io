import type { Game, Player, TerraNullius } from "./Game";
import { TileRef } from "./GameMap";
import { terrainProfile } from "./TerrainSystem";

export interface MoraleState {
  value: number;
  terrainModifier: number;
  pressureModifier: number;
  logisticsModifier: number;
  statusModifier: number;
}

export interface CombatMoraleModifiers {
  attackerMorale: MoraleState;
  defenderMorale: MoraleState;
  attackerLossMultiplier: number;
  defenderLossMultiplier: number;
  speedMultiplier: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pressureModifier(player: Player): number {
  const incoming = player.incomingAttacks().length;
  const outgoing = player.outgoingAttacks().length;
  return clamp(1 + outgoing * 0.025 - incoming * 0.035, 0.86, 1.12);
}

function logisticsModifier(player: Player): number {
  const tilesOwned = Math.max(1, player.numTilesOwned());
  const troopDensity = player.troops() / tilesOwned;
  const overextension =
    tilesOwned > 75_000 ? clamp(75_000 / tilesOwned, 0.82, 1) : 1;
  const densityConfidence = clamp(troopDensity / 12, 0.9, 1.08);
  return overextension * densityConfidence;
}

function statusModifier(player: Player): number {
  let modifier = 1;
  if (player.isTraitor()) {
    modifier *= 0.82;
  }
  if (player.isDisconnected()) {
    modifier *= 0.9;
  }
  return modifier;
}

export function moraleState(
  game: Game,
  player: Player | TerraNullius,
  tile: TileRef,
): MoraleState {
  if (!player.isPlayer()) {
    return {
      value: 0.94,
      terrainModifier: 1,
      pressureModifier: 1,
      logisticsModifier: 1,
      statusModifier: 0.94,
    };
  }

  const terrainModifier = terrainProfile(game, tile).moraleModifier;
  const pressure = pressureModifier(player);
  const logistics = logisticsModifier(player);
  const status = statusModifier(player);
  const value = clamp(
    terrainModifier * pressure * logistics * status,
    0.72,
    1.18,
  );

  return {
    value,
    terrainModifier,
    pressureModifier: pressure,
    logisticsModifier: logistics,
    statusModifier: status,
  };
}

export function combatMoraleModifiers(
  game: Game,
  attacker: Player,
  defender: Player | TerraNullius,
  tile: TileRef,
): CombatMoraleModifiers {
  const attackerMorale = moraleState(game, attacker, tile);
  const defenderMorale = moraleState(game, defender, tile);
  const moraleDelta = defenderMorale.value - attackerMorale.value;

  return {
    attackerMorale,
    defenderMorale,
    attackerLossMultiplier: clamp(1 + moraleDelta * 0.35, 0.82, 1.18),
    defenderLossMultiplier: clamp(1 - moraleDelta * 0.28, 0.86, 1.14),
    speedMultiplier: clamp(1 - moraleDelta * 0.22, 0.88, 1.12),
  };
}
