import { DominionMilitaryUnitTypes } from "../../entities/UnitTypes";
import { Unit, UnitType } from "../../game/Game";
import {
  MilitaryUnitExecution,
  MilitaryUnitInput,
} from "./MilitaryUnitExecution";

export class MedicExecution extends MilitaryUnitExecution<UnitType.Medic> {
  constructor(input: MilitaryUnitInput<UnitType.Medic>) {
    super(input, UnitType.Medic);
  }

  protected override onTick(ticks: number): void {
    if (this.unit === null || ticks % 10 !== 0) {
      return;
    }
    const healing = this.unit.info().healingPerTick ?? 0;
    if (healing <= 0) {
      return;
    }
    const allies = this.mg
      .nearbyUnits(
        this.unit.tile(),
        2,
        DominionMilitaryUnitTypes,
        (candidate) =>
          (candidate.unit as Unit).id() !== this.unit!.id() &&
          this.unit!.owner().isFriendly((candidate.unit as Unit).owner()) &&
          (candidate.unit as Unit).hasHealth() &&
          (candidate.unit as Unit).health() <
            ((candidate.unit as Unit).info().maxHealth ?? 0),
      )
      .sort(
        (a, b) => a.distSquared - b.distSquared || a.unit.id() - b.unit.id(),
      );
    for (const { unit } of allies.slice(0, 3)) {
      unit.modifyHealth(healing, this.unit.owner());
    }
  }
}
