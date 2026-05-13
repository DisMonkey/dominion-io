export enum MilitaryDoctrine {
  MassAssault = "mass_assault",
  SuperiorFirepower = "superior_firepower",
  MobileWarfare = "mobile_warfare",
  GrandBattlePlan = "grand_battle_plan",
}

export interface DoctrineModifiers {
  infantryCostMultiplier?: number;
  maxArmySizeMultiplier?: number;
  unitStrengthMultiplier?: number;
  unitCostMultiplier?: number;
  artilleryRangeBonus?: number;
  unitSpeedMultiplier?: number;
  tankCostMultiplier?: number;
  blitzCooldownDeltaTicks?: number;
  plannedOffensiveDamageMultiplier?: number;
  fortifiedDefenseMultiplier?: number;
}

export const DoctrineDefinitions = {
  [MilitaryDoctrine.MassAssault]: {
    infantryCostMultiplier: 0.7,
    maxArmySizeMultiplier: 1.5,
    unitStrengthMultiplier: 0.85,
  },
  [MilitaryDoctrine.SuperiorFirepower]: {
    unitStrengthMultiplier: 1.25,
    unitCostMultiplier: 1.4,
    artilleryRangeBonus: 1,
  },
  [MilitaryDoctrine.MobileWarfare]: {
    unitSpeedMultiplier: 1.3,
    tankCostMultiplier: 0.8,
    blitzCooldownDeltaTicks: -600,
  },
  [MilitaryDoctrine.GrandBattlePlan]: {
    plannedOffensiveDamageMultiplier: 1.5,
    fortifiedDefenseMultiplier: 1.75,
  },
} as const satisfies Record<MilitaryDoctrine, DoctrineModifiers>;
