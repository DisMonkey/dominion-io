import { UnitType } from "../../game/Game";
import {
  MilitaryUnitExecution,
  MilitaryUnitInput,
} from "./MilitaryUnitExecution";

export class InfantryExecution extends MilitaryUnitExecution<UnitType.Infantry> {
  constructor(input: MilitaryUnitInput<UnitType.Infantry>) {
    super(input, UnitType.Infantry);
  }

  protected override onTick(ticks: number): void {
    this.strikeNearestHostile(ticks);
  }
}
