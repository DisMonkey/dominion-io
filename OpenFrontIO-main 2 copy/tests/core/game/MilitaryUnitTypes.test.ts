import { describe, expect, test } from "vitest";
import {
  DominionMilitaryUnitTypes,
  MilitaryUnitStatsByType,
} from "../../../src/core/entities/UnitTypes";
import { PlayerInfo, PlayerType, UnitType } from "../../../src/core/game/Game";
import { setup } from "../../util/Setup";

describe("Dominion military unit types", () => {
  test("defines deterministic stats for every military unit", async () => {
    const game = await setup("plains", { instantBuild: true });
    const player = game.addPlayer(
      new PlayerInfo("commander", PlayerType.Human, null, "commander"),
    );

    for (const unitType of DominionMilitaryUnitTypes) {
      const unitInfo = game.unitInfo(unitType);
      const stats = MilitaryUnitStatsByType[unitType];

      expect(unitInfo.attackPower).toBe(stats.attackPower);
      expect(unitInfo.defenseModifier).toBe(stats.defenseModifier);
      expect(unitInfo.movementSpeed).toBe(stats.movementSpeed);
      expect(unitInfo.visionRadius).toBe(stats.visionRadius);
      expect(unitInfo.range).toBe(stats.range);
      expect(unitInfo.cost(game, player)).toBeGreaterThan(0n);
    }
  });

  test("serializes newly built military units through unit updates", async () => {
    const game = await setup("plains", {
      infiniteGold: true,
      instantBuild: true,
    });
    const player = game.addPlayer(
      new PlayerInfo("commander", PlayerType.Human, null, "commander"),
    );
    const spawnTile = game.map().ref(0, 0);
    player.conquer(spawnTile);

    const tank = player.buildUnit(UnitType.Tank, spawnTile, {});
    const update = tank.toUpdate();

    expect(update.unitType).toBe(UnitType.Tank);
    expect(update.ownerID).toBe(player.smallID());
    expect(update.pos).toBe(spawnTile);
    expect(update.health).toBe(game.unitInfo(UnitType.Tank).maxHealth);
  });
});
