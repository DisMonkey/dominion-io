import { describe, expect, test } from "vitest";
import { FogOfWarSystem, FogVisibility } from "../../src/core/FogOfWarSystem";
import { PlayerInfo, PlayerType, UnitType } from "../../src/core/game/Game";
import { setup } from "../util/Setup";

describe("FogOfWarSystem", () => {
  test("reveals owned territory at a two-tile radius", async () => {
    const game = await setup("plains", { instantBuild: true });
    const player = game.addPlayer(
      new PlayerInfo("scoutless", PlayerType.Human, null, "scoutless"),
    );
    const origin = game.map().ref(10, 10);
    player.conquer(origin);

    const fog = new FogOfWarSystem(game);
    fog.updatePlayer(player);

    expect(fog.tileVisibility(player, origin)).toBe(FogVisibility.Visible);
    expect(fog.tileVisibility(player, game.map().ref(12, 10))).toBe(
      FogVisibility.Visible,
    );
    expect(fog.tileVisibility(player, game.map().ref(13, 10))).toBe(
      FogVisibility.Hidden,
    );
  });

  test("scouts reveal a five-tile radius and old vision becomes last-seen", async () => {
    const game = await setup("plains", {
      infiniteGold: true,
      instantBuild: true,
    });
    const player = game.addPlayer(
      new PlayerInfo("recon", PlayerType.Human, null, "recon"),
    );
    const origin = game.map().ref(10, 10);
    player.conquer(origin);
    const scout = player.buildUnit(UnitType.Scout, origin, {});

    const fog = new FogOfWarSystem(game);
    fog.updatePlayer(player);

    expect(fog.tileVisibility(player, game.map().ref(15, 10))).toBe(
      FogVisibility.Visible,
    );

    scout.move(game.map().ref(10, 11));
    fog.updatePlayer(player);

    expect(fog.tileVisibility(player, game.map().ref(15, 10))).toBe(
      FogVisibility.Revealed,
    );
  });
});
