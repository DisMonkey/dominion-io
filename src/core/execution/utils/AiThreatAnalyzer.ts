import { Game, Player, PlayerType, Structures } from "../../game/Game";

export interface AiThreatScore {
  player: Player;
  attackScore: number;
  threatScore: number;
  expansionValue: number;
}

export class AiThreatAnalyzer {
  constructor(
    private game: Game,
    private self: Player,
  ) {}

  rankAttackTargets(candidates: Player[]): AiThreatScore[] {
    return candidates
      .map((player) => this.score(player))
      .sort((a, b) => b.attackScore - a.attackScore);
  }

  score(player: Player): AiThreatScore {
    const selfTroops = Math.max(1, this.self.troops());
    const targetTroops = Math.max(1, player.troops());
    const targetTiles = Math.max(1, player.numTilesOwned());
    const targetMaxTroops = Math.max(1, this.game.config().maxTroops(player));
    const troopAdvantage = selfTroops / targetTroops;
    const weakness = 1 - Math.min(1, targetTroops / targetMaxTroops);
    const density = targetTroops / targetTiles;
    const structureValue = player.units().some((unit) =>
      Structures.has(unit.type()),
    )
      ? 0.18
      : 0;
    const incomingPressure =
      player.incomingAttacks().reduce((sum, attack) => sum + attack.troops(), 0) /
      targetTroops;
    const hostilePressure =
      this.self
        .incomingAttacks()
        .filter((attack) => attack.attacker() === player)
        .reduce((sum, attack) => sum + attack.troops(), 0) / selfTroops;

    const traitorValue = player.isTraitor() ? 0.22 : 0;
    const disconnectedValue = player.isDisconnected() ? 0.16 : 0;
    const botValue = player.type() === PlayerType.Bot ? 0.08 : 0;

    const expansionValue =
      Math.min(0.28, 1500 / targetTiles) +
      structureValue +
      botValue +
      disconnectedValue;

    const threatScore =
      Math.min(0.35, hostilePressure) +
      Math.min(0.24, density / 20000) +
      (player.type() === PlayerType.Human ? 0.08 : 0);

    const attackScore =
      Math.min(0.3, troopAdvantage / 8) +
      weakness * 0.22 +
      Math.min(0.22, incomingPressure) +
      expansionValue +
      threatScore +
      traitorValue;

    return {
      player,
      attackScore,
      threatScore,
      expansionValue,
    };
  }
}
