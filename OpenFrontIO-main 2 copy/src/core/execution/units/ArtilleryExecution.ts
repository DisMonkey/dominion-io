import { UnitType } from "../../game/Game";
import {
  MilitaryUnitExecution,
  MilitaryUnitInput,
} from "./MilitaryUnitExecution";

export class ArtilleryExecution extends MilitaryUnitExecution<UnitType.Artillery> {
  constructor(input: MilitaryUnitInput<UnitType.Artillery>) {
    super(input, UnitType.Artillery);
  }

  protected override onTick(ticks: number): void {
    this.strikeNearestHostile(ticks);
  }
}
