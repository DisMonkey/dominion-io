import { describe, expect, test } from "vitest";
import {
  assignAirMission,
  contestedAirEffectiveness,
} from "../../src/core/AirSystem";
import {
  DominionGameMode,
  DominionGameModeDefinitions,
} from "../../src/core/GameMode";
import { AgentMission, resolveAgentMission } from "../../src/core/IntelSystem";
import {
  Ideology,
  ideologyAllianceModifier,
  politicalPowerAtTick,
} from "../../src/core/PoliticalSystem";
import { warGoalProgress, warGoalReward } from "../../src/core/WarGoals";
import {
  AbilityDefinitions,
  AbilityType,
} from "../../src/core/abilities/Abilities";
import { AirMission, AirWing } from "../../src/core/entities/AirUnit";
import { WorldEvents } from "../../src/core/events/WorldEvents";

describe("Dominion strategic system definitions", () => {
  test("defines abilities and game modes with deterministic numeric tuning", () => {
    expect(AbilityDefinitions[AbilityType.Blitz].cooldownTicks).toBe(1800);
    expect(
      DominionGameModeDefinitions[DominionGameMode.Blitz].resourceMultiplier,
    ).toBe(3);
    expect(
      DominionGameModeDefinitions[DominionGameMode.TeamDomination].winCondition,
    ).toContain("70%");
  });

  test("resolves political, air, intel, war goal, and event helpers deterministically", () => {
    expect(politicalPowerAtTick(2n, 15)).toBe(5n);
    expect(
      ideologyAllianceModifier(Ideology.Democratic, Ideology.Democratic)
        .ceasefireCostMultiplier,
    ).toBe(0.85);

    const wing: AirWing = {
      id: 1,
      owner: "a",
      mission: AirMission.Recon,
      centerTile: 10,
      radius: 5,
      assignedAtTick: 0,
    };
    const reassigned = assignAirMission(
      wing,
      AirMission.AirSuperiority,
      12,
      100,
    );
    expect(reassigned.centerTile).toBe(12);
    expect(contestedAirEffectiveness([reassigned], "a", "b")).toBe(1);

    expect(resolveAgentMission(20, AgentMission.CoupDEtat)).toEqual({
      success: true,
      caught: false,
    });
    expect(warGoalReward(2)).toEqual({
      gold: 500n,
      incomeBonusPercent: 10,
    });
    expect(
      warGoalProgress([
        { playerId: "a", tile: 1, capturedAtTick: 20 },
        { playerId: "a", tile: 2 },
      ]),
    ).toEqual({ captured: 1, total: 2 });
    expect(WorldEvents.map((event) => event.id)).toContain("arms_race");
  });
});
