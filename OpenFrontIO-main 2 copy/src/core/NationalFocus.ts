import { Tech } from "./TechTree";

export enum NationalFocus {
  MilitaryExpansion = "military_expansion",
  ArmedForcesAct = "armed_forces_act",
  EliteForces = "elite_forces",
  BlitzkriegDoctrine = "blitzkrieg_doctrine",
  FiveYearPlan = "five_year_plan",
  WarEconomy = "war_economy",
  SyntheticFuel = "synthetic_fuel",
  GreatPowerStatus = "great_power_status",
  NonAggressionPact = "non_aggression_pact",
  CoalitionBuilder = "coalition_builder",
  TotalMobilization = "total_mobilization",
  PropagandaMinistry = "propaganda_ministry",
  SecretPolice = "secret_police",
}

export interface NationalFocusDefinition {
  focus: NationalFocus;
  branch: "military" | "industrial" | "diplomatic" | "political";
  durationTicks: number;
  politicalPowerCost: bigint;
  prerequisites: readonly NationalFocus[];
  unlocksTech?: Tech;
  effect: string;
}

export const NationalFocusDefinitions = {
  [NationalFocus.MilitaryExpansion]: {
    focus: NationalFocus.MilitaryExpansion,
    branch: "military",
    durationTicks: 60,
    politicalPowerCost: 25n,
    prerequisites: [],
    effect: "+10% unit production speed",
  },
  [NationalFocus.ArmedForcesAct]: {
    focus: NationalFocus.ArmedForcesAct,
    branch: "military",
    durationTicks: 100,
    politicalPowerCost: 25n,
    prerequisites: [NationalFocus.MilitaryExpansion],
    effect: "Unlocks 2 additional unit slots",
  },
  [NationalFocus.EliteForces]: {
    focus: NationalFocus.EliteForces,
    branch: "military",
    durationTicks: 140,
    politicalPowerCost: 25n,
    prerequisites: [NationalFocus.MilitaryExpansion],
    effect: "Infantry gains +20% attack power",
  },
  [NationalFocus.BlitzkriegDoctrine]: {
    focus: NationalFocus.BlitzkriegDoctrine,
    branch: "military",
    durationTicks: 180,
    politicalPowerCost: 25n,
    prerequisites: [NationalFocus.ArmedForcesAct],
    effect: "Tanks move 50% faster",
  },
  [NationalFocus.FiveYearPlan]: {
    focus: NationalFocus.FiveYearPlan,
    branch: "industrial",
    durationTicks: 90,
    politicalPowerCost: 25n,
    prerequisites: [],
    effect: "+25% Production resource generation",
  },
  [NationalFocus.WarEconomy]: {
    focus: NationalFocus.WarEconomy,
    branch: "industrial",
    durationTicks: 120,
    politicalPowerCost: 25n,
    prerequisites: [NationalFocus.FiveYearPlan],
    effect: "Convert Gold to Production at 2:1 rate",
  },
  [NationalFocus.SyntheticFuel]: {
    focus: NationalFocus.SyntheticFuel,
    branch: "industrial",
    durationTicks: 160,
    politicalPowerCost: 25n,
    prerequisites: [NationalFocus.WarEconomy],
    effect: "Never run out of Energy",
  },
  [NationalFocus.GreatPowerStatus]: {
    focus: NationalFocus.GreatPowerStatus,
    branch: "diplomatic",
    durationTicks: 80,
    politicalPowerCost: 25n,
    prerequisites: [],
    effect: "Other players see you as a major power",
  },
  [NationalFocus.NonAggressionPact]: {
    focus: NationalFocus.NonAggressionPact,
    branch: "diplomatic",
    durationTicks: 100,
    politicalPowerCost: 25n,
    prerequisites: [NationalFocus.GreatPowerStatus],
    effect: "Automatically proposes ceasefire to top 3 neighbors",
  },
  [NationalFocus.CoalitionBuilder]: {
    focus: NationalFocus.CoalitionBuilder,
    branch: "diplomatic",
    durationTicks: 160,
    politicalPowerCost: 25n,
    prerequisites: [NationalFocus.GreatPowerStatus],
    effect: "Alliance cap raised from 3 to 6 players",
  },
  [NationalFocus.TotalMobilization]: {
    focus: NationalFocus.TotalMobilization,
    branch: "political",
    durationTicks: 180,
    politicalPowerCost: 25n,
    prerequisites: [],
    effect: "All territory generates +30% income, but Energy upkeep doubles",
  },
  [NationalFocus.PropagandaMinistry]: {
    focus: NationalFocus.PropagandaMinistry,
    branch: "political",
    durationTicks: 120,
    politicalPowerCost: 25n,
    prerequisites: [],
    effect: "Propaganda ability cooldown halved",
  },
  [NationalFocus.SecretPolice]: {
    focus: NationalFocus.SecretPolice,
    branch: "political",
    durationTicks: 130,
    politicalPowerCost: 25n,
    prerequisites: [NationalFocus.PropagandaMinistry],
    effect: "Reveals all spies targeting you",
  },
} as const satisfies Record<NationalFocus, NationalFocusDefinition>;
