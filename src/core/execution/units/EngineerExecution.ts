import { UnitType } from "../../game/Game";
import {
  MilitaryUnitExecution,
  MilitaryUnitInput,
} from "./MilitaryUnitExecution";

export class EngineerExecution extends MilitaryUnitExecution<UnitType.Engineer> {
  constructor(input: MilitaryUnitInput<UnitType.Engineer>) {
    super(input, UnitType.Engineer);
  }
}
