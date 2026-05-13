import { PlayerID } from "./game/Game";

export enum AgentMission {
  StealBlueprints = "steal_blueprints",
  SabotageFactory = "sabotage_factory",
  CoupDEtat = "coup_d_etat",
  InfiltrateGovernment = "infiltrate_government",
}

export interface Agent {
  id: number;
  owner: PlayerID;
  assignedMission?: AgentMission;
  target?: PlayerID;
}

export interface AgentMissionOutcome {
  successThreshold: number;
  caughtThreshold: number;
}

export const AGENT_RECRUIT_COST = 200n;
export const MAX_AGENTS_PER_PLAYER = 3;

export const AgentMissionOutcomes = {
  [AgentMission.StealBlueprints]: {
    successThreshold: 50,
    caughtThreshold: 40,
  },
  [AgentMission.SabotageFactory]: {
    successThreshold: 65,
    caughtThreshold: 40,
  },
  [AgentMission.CoupDEtat]: {
    successThreshold: 30,
    caughtThreshold: 40,
  },
  [AgentMission.InfiltrateGovernment]: {
    successThreshold: 75,
    caughtThreshold: 40,
  },
} as const satisfies Record<AgentMission, AgentMissionOutcome>;

export function resolveAgentMission(
  roll: number,
  mission: AgentMission,
): { success: boolean; caught: boolean } {
  const outcome = AgentMissionOutcomes[mission];
  return {
    success: roll < outcome.successThreshold,
    caught: roll >= 100 - outcome.caughtThreshold,
  };
}
