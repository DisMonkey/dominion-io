import { PlayerID, Tick } from "./game/Game";

export enum DiplomaticAgreementLevel {
  Ceasefire = "ceasefire",
  Alliance = "alliance",
  VassalPact = "vassal_pact",
}

export interface DiplomaticAgreement {
  id: string;
  level: DiplomaticAgreementLevel;
  requestor: PlayerID;
  recipient: PlayerID;
  createdAt: Tick;
  expiresAt?: Tick;
  breakWarningIssuedAt?: Tick;
  tributePerTick?: bigint;
}

export interface DiplomaticEvent {
  tick: Tick;
  message: string;
  players: readonly PlayerID[];
  level: DiplomaticAgreementLevel;
}

export function canBreakCeasefire(
  agreement: DiplomaticAgreement,
  tick: Tick,
): boolean {
  if (agreement.level !== DiplomaticAgreementLevel.Ceasefire) {
    return true;
  }
  return (
    agreement.breakWarningIssuedAt !== undefined &&
    tick - agreement.breakWarningIssuedAt >= 10
  );
}

export function warmongerBadgeFor(betrayals: number): "none" | "warmonger" {
  return betrayals > 0 ? "warmonger" : "none";
}
