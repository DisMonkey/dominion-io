import { TileRef } from "./game/GameMap";

export enum ResourceType {
  Gold = "gold",
  Production = "production",
  Energy = "energy",
  PoliticalPower = "political_power",
}

export type ResourceWallet = Record<ResourceType, bigint>;

export enum EconomicTileType {
  City = "city",
  Industrial = "industrial",
  Port = "port",
  PowerPlant = "power_plant",
  Rural = "rural",
}

export interface TileResourceYield {
  tile: TileRef;
  tileType: EconomicTileType;
  resources: Partial<ResourceWallet>;
}

export function createResourceWallet(): ResourceWallet {
  return {
    [ResourceType.Gold]: 0n,
    [ResourceType.Production]: 0n,
    [ResourceType.Energy]: 0n,
    [ResourceType.PoliticalPower]: 0n,
  };
}

export function addResources(
  wallet: ResourceWallet,
  delta: Partial<ResourceWallet>,
): ResourceWallet {
  return {
    [ResourceType.Gold]: wallet.gold + (delta.gold ?? 0n),
    [ResourceType.Production]: wallet.production + (delta.production ?? 0n),
    [ResourceType.Energy]: wallet.energy + (delta.energy ?? 0n),
    [ResourceType.PoliticalPower]:
      wallet.political_power + (delta.political_power ?? 0n),
  };
}

export function tileYield(
  tile: TileRef,
  tileType: EconomicTileType,
): TileResourceYield {
  switch (tileType) {
    case EconomicTileType.City:
      return { tile, tileType, resources: { gold: 100n } };
    case EconomicTileType.Industrial:
      return { tile, tileType, resources: { production: 120n } };
    case EconomicTileType.Port:
      return {
        tile,
        tileType,
        resources: { gold: 60n, production: 40n },
      };
    case EconomicTileType.PowerPlant:
      return { tile, tileType, resources: { energy: 80n } };
    case EconomicTileType.Rural:
      return { tile, tileType, resources: { gold: 15n } };
  }
}
