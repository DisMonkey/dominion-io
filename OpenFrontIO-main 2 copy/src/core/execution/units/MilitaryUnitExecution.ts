import {
  DominionMilitaryUnitTypes,
  MilitaryUnitType,
} from "../../entities/UnitTypes";
import {
  Execution,
  Game,
  isUnit,
  OwnerComp,
  Unit,
  UnitParams,
} from "../../game/Game";
import { TileRef } from "../../game/GameMap";

export type MilitaryUnitInput<T extends MilitaryUnitType> =
  | Unit
  | (OwnerComp & {
      type: T;
      tile: TileRef;
    });

export abstract class MilitaryUnitExecution<
  T extends MilitaryUnitType,
> implements Execution {
  protected mg: Game;
  protected unit: Unit | null = null;
  private active = true;

  protected constructor(
    private input: MilitaryUnitInput<T>,
    private readonly unitType: T,
  ) {}

  init(mg: Game): void {
    this.mg = mg;
    if (isUnit(this.input)) {
      this.unit = this.input;
      return;
    }

    const spawn = this.input.owner.canBuild(this.unitType, this.input.tile);
    if (spawn === false) {
      console.warn(
        `Failed to spawn ${this.unitType} for ${this.input.owner.name()} at ${this.input.tile}`,
      );
      this.active = false;
      return;
    }

    this.unit = this.input.owner.buildUnit(
      this.unitType,
      spawn,
      {} as UnitParams<T>,
    );
  }

  tick(ticks: number): void {
    if (this.unit === null || !this.unit.isActive()) {
      this.active = false;
      return;
    }
    this.onTick(ticks);
  }

  protected onTick(_ticks: number): void {
    this.active = false;
  }

  protected findHostileMilitaryTarget(
    range: number,
  ): { unit: Unit; distSquared: number } | undefined {
    if (this.unit === null) {
      return undefined;
    }
    return this.mg
      .nearbyUnits(
        this.unit.tile(),
        range,
        DominionMilitaryUnitTypes,
        (candidate) =>
          !this.unit!.owner().isFriendly((candidate.unit as Unit).owner()),
      )
      .sort(
        (a, b) => a.distSquared - b.distSquared || a.unit.id() - b.unit.id(),
      )[0];
  }

  protected strikeNearestHostile(ticks: number): void {
    if (this.unit === null) {
      this.active = false;
      return;
    }
    const info = this.unit.info();
    const cooldown = info.cooldownTicks ?? 10;
    if (ticks % cooldown !== 0) {
      return;
    }
    const target = this.findHostileMilitaryTarget(info.range ?? 1);
    if (target === undefined) {
      return;
    }
    target.unit.modifyHealth(
      -(info.damage ?? info.attackPower ?? 1),
      this.unit.owner(),
    );
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }
}
