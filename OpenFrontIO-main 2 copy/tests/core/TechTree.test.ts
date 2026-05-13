import { describe, expect, test } from "vitest";
import { PlayerInfo, PlayerType } from "../../src/core/game/Game";
import { Tech, TechDefinitions } from "../../src/core/TechTree";
import { setup } from "../util/Setup";

describe("TechTree", () => {
  test("starts one deterministic research project at a time", async () => {
    const game = await setup("plains", { instantBuild: true });
    const player = game.addPlayer(
      new PlayerInfo("researcher", PlayerType.Human, null, "researcher"),
    );
    player.addGold(TechDefinitions[Tech.ImprovedLogistics].cost);

    expect(player.startResearch(Tech.ImprovedLogistics, 10)).toBe(true);
    expect(player.activeResearch()).toEqual({
      tech: Tech.ImprovedLogistics,
      startedAt: 10,
      completesAt: 10 + TechDefinitions[Tech.ImprovedLogistics].durationTicks,
    });
    expect(player.startResearch(Tech.ArmoredDivision, 11)).toBe(false);
  });

  test("enforces prerequisites and completes research by tick", async () => {
    const game = await setup("plains", { instantBuild: true });
    const player = game.addPlayer(
      new PlayerInfo("planner", PlayerType.Human, null, "planner"),
    );

    player.addGold(TechDefinitions[Tech.NuclearProgram].cost);
    expect(player.canResearch(Tech.NuclearProgram)).toBe(false);

    for (const tech of [Tech.ArmoredDivision, Tech.SteelFortress]) {
      player.addGold(TechDefinitions[tech].cost);
      expect(player.startResearch(tech, 0)).toBe(true);
      expect(player.tickResearch(TechDefinitions[tech].durationTicks)).toBe(
        tech,
      );
    }

    expect(player.canResearch(Tech.NuclearProgram)).toBe(true);
  });
});
