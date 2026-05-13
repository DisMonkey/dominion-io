import { UnitType } from "../game/Game";

export { UnitType };

export type MilitaryUnitType =
  | UnitType.Infantry
  | UnitType.Tank
  | UnitType.Artillery
  | UnitType.Scout
  | UnitType.Sniper
  | UnitType.Medic
  | UnitType.Engineer;

export interface MilitaryUnitStats {
  attackPower: number;
  defenseModifier: number;
  movementSpeed: number;
  costMultiplier: number;
  visionRadius: number;
  range: number;
  cooldownTicks?: number;
  energyUpkeep?: number;
  healingPerTick?: number;
}

export const DominionMilitaryUnitTypes = [
  UnitType.Infantry,
  UnitType.Tank,
  UnitType.Artillery,
  UnitType.Scout,
  UnitType.Sniper,
  UnitType.Medic,
  UnitType.Engineer,
] as const satisfies readonly MilitaryUnitType[];

export const MilitaryUnitStatsByType = {
  [UnitType.Infantry]: {
    attackPower: 10,
    defenseModifier: 1,
    movementSpeed: 1,
    costMultiplier: 1,
    visionRadius: 2,
    range: 1,
  },
  [UnitType.Tank]: {
    attackPower: 34,
    defenseModifier: 1.8,
    movementSpeed: 0.65,
    costMultiplier: 3,
    visionRadius: 3,
    range: 1,
    energyUpkeep: 2,
  },
  [UnitType.Artillery]: {
    attackPower: 46,
    defenseModifier: 0.75,
    movementSpeed: 0.45,
    costMultiplier: 2.5,
    visionRadius: 3,
    range: 2,
    cooldownTicks: 20,
    energyUpkeep: 1,
  },
  [UnitType.Scout]: {
    attackPower: 6,
    defenseModifier: 0.8,
    movementSpeed: 2,
    costMultiplier: 1.5,
    visionRadius: 5,
    range: 1,
  },
  [UnitType.Sniper]: {
    attackPower: 65,
    defenseModifier: 0.65,
    movementSpeed: 0.85,
    costMultiplier: 2,
    visionRadius: 4,
    range: 3,
    cooldownTicks: 60,
  },
  [UnitType.Medic]: {
    attackPower: 2,
    defenseModifier: 0.9,
    movementSpeed: 1,
    costMultiplier: 1.8,
    visionRadius: 2,
    range: 1,
    healingPerTick: 3,
  },
  [UnitType.Engineer]: {
    attackPower: 8,
    defenseModifier: 1.1,
    movementSpeed: 0.9,
    costMultiplier: 2.4,
    visionRadius: 2,
    range: 1,
  },
} as const satisfies Record<MilitaryUnitType, MilitaryUnitStats>;

export function isMilitaryUnitType(type: UnitType): type is MilitaryUnitType {
  return DominionMilitaryUnitTypes.includes(type as MilitaryUnitType);
}
