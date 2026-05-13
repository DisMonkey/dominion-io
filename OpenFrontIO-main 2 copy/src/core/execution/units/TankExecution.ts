import { UnitType } from "../../game/Game";
import {
  MilitaryUnitExecution,
  MilitaryUnitInput,
} from "./MilitaryUnitExecution";

export class TankExecution extends MilitaryUnitExecution<UnitType.Tank> {
  constructor(input: MilitaryUnitInput<UnitType.Tank>) {
    super(input, UnitType.Tank);
  }

  protected override onTick(ticks: number): void {
    this.strikeNearestHostile(ticks);
  }
}
