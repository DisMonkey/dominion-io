export enum Tech {
  ImprovedLogistics = "improved_logistics",
  ArmoredDivision = "armored_division",
  ArtilleryCorps = "artillery_corps",
  IntelligenceNetwork = "intelligence_network",
  SteelFortress = "steel_fortress",
  NavalDominance = "naval_dominance",
  NuclearProgram = "nuclear_program",
  AirSuperiority = "air_superiority",
}

export interface TechDefinition {
  tech: Tech;
  cost: bigint;
  durationTicks: number;
  prerequisites: readonly Tech[];
  description: string;
}

export interface ActiveResearch {
  tech: Tech;
  startedAt: number;
  completesAt: number;
}

export const TechDefinitions = {
  [Tech.ImprovedLogistics]: {
    tech: Tech.ImprovedLogistics,
    cost: 250_000n,
    durationTicks: 80,
    prerequisites: [],
    description: "+15% troop movement speed",
  },
  [Tech.ArmoredDivision]: {
    tech: Tech.ArmoredDivision,
    cost: 500_000n,
    durationTicks: 120,
    prerequisites: [],
    description: "Unlocks Tank units",
  },
  [Tech.ArtilleryCorps]: {
    tech: Tech.ArtilleryCorps,
    cost: 450_000n,
    durationTicks: 110,
    prerequisites: [],
    description: "Unlocks Artillery units",
  },
  [Tech.IntelligenceNetwork]: {
    tech: Tech.IntelligenceNetwork,
    cost: 400_000n,
    durationTicks: 100,
    prerequisites: [],
    description: "Fog of war reveals enemy economy",
  },
  [Tech.SteelFortress]: {
    tech: Tech.SteelFortress,
    cost: 550_000n,
    durationTicks: 130,
    prerequisites: [],
    description: "Wall defense +50%",
  },
  [Tech.NavalDominance]: {
    tech: Tech.NavalDominance,
    cost: 475_000n,
    durationTicks: 115,
    prerequisites: [],
    description: "Warships deal 2x damage to trade ships",
  },
  [Tech.NuclearProgram]: {
    tech: Tech.NuclearProgram,
    cost: 1_250_000n,
    durationTicks: 220,
    prerequisites: [Tech.ArmoredDivision, Tech.SteelFortress],
    description: "Unlocks nuclear escalation systems",
  },
  [Tech.AirSuperiority]: {
    tech: Tech.AirSuperiority,
    cost: 900_000n,
    durationTicks: 180,
    prerequisites: [Tech.IntelligenceNetwork],
    description: "Unlocks air strike ability",
  },
} as const satisfies Record<Tech, TechDefinition>;

export function canResearchTech(
  completed: ReadonlySet<Tech>,
  active: ActiveResearch | null,
  tech: Tech,
): boolean {
  if (active !== null || completed.has(tech)) {
    return false;
  }
  return TechDefinitions[tech].prerequisites.every((required) =>
    completed.has(required),
  );
}
