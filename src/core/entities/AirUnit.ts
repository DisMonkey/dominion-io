import { PlayerID } from "../game/Game";
import { TileRef } from "../game/GameMap";

export enum AirMission {
  AirSuperiority = "air_superiority",
  StrategicBombing = "strategic_bombing",
  CloseAirSupport = "close_air_support",
  Recon = "recon",
}

export interface AirWing {
  id: number;
  owner: PlayerID;
  mission: AirMission;
  centerTile: TileRef;
  radius: number;
  assignedAtTick: number;
}
