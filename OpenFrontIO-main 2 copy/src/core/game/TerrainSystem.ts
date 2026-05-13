import { TerrainType } from "./Game";
import { GameMap, TileRef } from "./GameMap";

export enum StrategicTerrainType {
  Plains = "plains",
  Forest = "forest",
  Mountain = "mountain",
  Desert = "desert",
  Snow = "snow",
  Water = "water",
}

export interface TerrainProfile {
  type: StrategicTerrainType;
  defenseMultiplier: number;
  assaultSpeedMultiplier: number;
  moraleModifier: number;
  visibilityMultiplier: number;
}

const TERRAIN_PROFILES: Record<StrategicTerrainType, TerrainProfile> = {
  [StrategicTerrainType.Plains]: {
    type: StrategicTerrainType.Plains,
    defenseMultiplier: 1,
    assaultSpeedMultiplier: 1,
    moraleModifier: 1,
    visibilityMultiplier: 1,
  },
  [StrategicTerrainType.Forest]: {
    type: StrategicTerrainType.Forest,
    defenseMultiplier: 1.12,
    assaultSpeedMultiplier: 0.9,
    moraleModifier: 1.04,
    visibilityMultiplier: 0.75,
  },
  [StrategicTerrainType.Mountain]: {
    type: StrategicTerrainType.Mountain,
    defenseMultiplier: 1.35,
    assaultSpeedMultiplier: 0.68,
    moraleModifier: 0.97,
    visibilityMultiplier: 0.55,
  },
  [StrategicTerrainType.Desert]: {
    type: StrategicTerrainType.Desert,
    defenseMultiplier: 0.95,
    assaultSpeedMultiplier: 0.86,
    moraleModifier: 0.94,
    visibilityMultiplier: 1.1,
  },
  [StrategicTerrainType.Snow]: {
    type: StrategicTerrainType.Snow,
    defenseMultiplier: 1.05,
    assaultSpeedMultiplier: 0.78,
    moraleModifier: 0.95,
    visibilityMultiplier: 0.85,
  },
  [StrategicTerrainType.Water]: {
    type: StrategicTerrainType.Water,
    defenseMultiplier: 1,
    assaultSpeedMultiplier: 1,
    moraleModifier: 1,
    visibilityMultiplier: 1,
  },
};

export function terrainProfile(
  gameMap: GameMap,
  tile: TileRef,
): TerrainProfile {
  return TERRAIN_PROFILES[strategicTerrainType(gameMap, tile)];
}

export function strategicTerrainType(
  gameMap: GameMap,
  tile: TileRef,
): StrategicTerrainType {
  if (!gameMap.isLand(tile)) {
    return StrategicTerrainType.Water;
  }

  const baseType = gameMap.terrainType(tile);
  if (baseType === TerrainType.Mountain) {
    return StrategicTerrainType.Mountain;
  }

  const y = gameMap.y(tile);
  const x = gameMap.x(tile);
  const height = Math.max(1, gameMap.height() - 1);
  const latitude = Math.abs(y / height - 0.5) * 2;
  const magnitude = gameMap.magnitude(tile);
  const noise = terrainNoise(x, y);

  if (latitude > 0.78 && magnitude >= 6) {
    return StrategicTerrainType.Snow;
  }

  if (latitude > 0.24 && latitude < 0.58 && magnitude < 16 && noise < 24) {
    return StrategicTerrainType.Desert;
  }

  if (magnitude < 18 && noise >= 24 && noise < 45) {
    return StrategicTerrainType.Forest;
  }

  return StrategicTerrainType.Plains;
}

function terrainNoise(x: number, y: number): number {
  let h = Math.imul(x + 0x9e3779b9, 0x85ebca6b);
  h ^= Math.imul(y + 0xc2b2ae35, 0x27d4eb2d);
  h ^= h >>> 15;
  return Math.abs(h % 100);
}
