import { UnitType } from "../../game/Game";
import {
  MilitaryUnitExecution,
  MilitaryUnitInput,
} from "./MilitaryUnitExecution";

export class SniperExecution extends MilitaryUnitExecution<UnitType.Sniper> {
  constructor(input: MilitaryUnitInput<UnitType.Sniper>) {
    super(input, UnitType.Sniper);
  }

  protected override onTick(ticks: number): void {
    this.strikeNearestHostile(ticks);
  }
}
