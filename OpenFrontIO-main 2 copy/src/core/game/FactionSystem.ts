export type FactionId =
  | "vanguard-directorate"
  | "helix-concord"
  | "obsidian-fleet"
  | "stratos-union"
  | "nomad-signal-corps";

export interface FactionProfile {
  id: FactionId;
  name: string;
  callsign: string;
  primary: string;
  accent: string;
  doctrine: string;
  traits: readonly string[];
}

export const DOMINION_COMMAND_FACTIONS: readonly FactionProfile[] = [
  {
    id: "vanguard-directorate",
    name: "Vanguard Directorate",
    callsign: "VGD",
    primary: "#0ea5e9",
    accent: "#f97316",
    doctrine: "combined-arms breakthrough",
    traits: ["armored spearheads", "forward logistics", "rapid fortification"],
  },
  {
    id: "helix-concord",
    name: "Helix Concord",
    callsign: "HLX",
    primary: "#22c55e",
    accent: "#67e8f9",
    doctrine: "adaptive defense network",
    traits: ["counter battery", "repair cadence", "alliance stabilization"],
  },
  {
    id: "obsidian-fleet",
    name: "Obsidian Fleet",
    callsign: "OBS",
    primary: "#64748b",
    accent: "#f43f5e",
    doctrine: "naval interdiction",
    traits: ["blue-water control", "missile pressure", "commerce raiding"],
  },
  {
    id: "stratos-union",
    name: "Stratos Union",
    callsign: "STU",
    primary: "#8b5cf6",
    accent: "#38bdf8",
    doctrine: "aerospace tempo",
    traits: ["long vision", "fast ordnance", "map-wide threat projection"],
  },
  {
    id: "nomad-signal-corps",
    name: "Nomad Signal Corps",
    callsign: "NSC",
    primary: "#eab308",
    accent: "#14b8a6",
    doctrine: "asymmetric expansion",
    traits: ["low footprint", "border pressure", "deception operations"],
  },
] as const;

export function factionById(id: FactionId): FactionProfile {
  const faction = DOMINION_COMMAND_FACTIONS.find((f) => f.id === id);
  if (faction === undefined) {
    throw new Error(`unknown faction id ${id}`);
  }
  return faction;
}

export function factionForPlayerIndex(index: number): FactionProfile {
  const normalized = Math.abs(Math.floor(index));
  return DOMINION_COMMAND_FACTIONS[normalized % DOMINION_COMMAND_FACTIONS.length];
}
