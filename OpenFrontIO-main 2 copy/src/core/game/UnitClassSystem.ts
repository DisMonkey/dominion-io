import { UnitType } from "./Game";

export type UnitClass =
  | "infantry"
  | "tanks"
  | "artillery"
  | "aircraft"
  | "naval";

export interface UnitClassProfile {
  unitClass: UnitClass;
  armor: number;
  mobility: number;
  range: number;
  vision: number;
  moralePressure: number;
}

const CLASS_PROFILES: Record<UnitClass, UnitClassProfile> = {
  infantry: {
    unitClass: "infantry",
    armor: 0.9,
    mobility: 0.9,
    range: 0.8,
    vision: 1.0,
    moralePressure: 0.8,
  },
  tanks: {
    unitClass: "tanks",
    armor: 1.35,
    mobility: 1.15,
    range: 0.95,
    vision: 0.95,
    moralePressure: 1.2,
  },
  artillery: {
    unitClass: "artillery",
    armor: 0.75,
    mobility: 0.7,
    range: 1.55,
    vision: 1.1,
    moralePressure: 1.35,
  },
  aircraft: {
    unitClass: "aircraft",
    armor: 0.65,
    mobility: 1.8,
    range: 1.4,
    vision: 1.6,
    moralePressure: 1.55,
  },
  naval: {
    unitClass: "naval",
    armor: 1.25,
    mobility: 1.05,
    range: 1.3,
    vision: 1.25,
    moralePressure: 1.15,
  },
};

export function unitClassForType(type: UnitType): UnitClass {
  switch (type) {
    case UnitType.TransportShip:
    case UnitType.Warship:
    case UnitType.TradeShip:
    case UnitType.Port:
      return "naval";
    case UnitType.Shell:
    case UnitType.MissileSilo:
    case UnitType.DefensePost:
      return "artillery";
    case UnitType.AtomBomb:
    case UnitType.HydrogenBomb:
    case UnitType.MIRV:
    case UnitType.MIRVWarhead:
    case UnitType.SAMMissile:
      return "aircraft";
    case UnitType.Factory:
    case UnitType.Train:
      return "tanks";
    case UnitType.City:
    case UnitType.SAMLauncher:
    default:
      return "infantry";
  }
}

export function unitClassProfile(type: UnitType): UnitClassProfile {
  return CLASS_PROFILES[unitClassForType(type)];
}

export function isNavalUnit(type: UnitType): boolean {
  return unitClassForType(type) === "naval";
}

export function isAirThreat(type: UnitType): boolean {
  return unitClassForType(type) === "aircraft";
}
