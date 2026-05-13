import { UnitType } from "../../game/Game";
import {
  MilitaryUnitExecution,
  MilitaryUnitInput,
} from "./MilitaryUnitExecution";

export class ScoutExecution extends MilitaryUnitExecution<UnitType.Scout> {
  constructor(input: MilitaryUnitInput<UnitType.Scout>) {
    super(input, UnitType.Scout);
  }
}
