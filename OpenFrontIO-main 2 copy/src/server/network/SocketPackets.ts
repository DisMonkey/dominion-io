import WebSocket, { RawData } from "ws";
import { z } from "zod";
import {
  ClientMessage,
  ClientMessageSchema,
  ServerMessage,
} from "../../core/Schemas";
import {
  decodePacketPayloadSync,
  encodePacket,
  MAX_CLIENT_PACKET_BYTES,
  packetPayloadByteLength,
} from "../../core/network/PacketCodec";

export type ClientSocketDecodeResult =
  | { ok: true; message: ClientMessage; bytes: number }
  | { ok: false; error: string; bytes: number; tooLarge: boolean };

export function decodeClientSocketMessage(
  payload: RawData,
): ClientSocketDecodeResult {
  const bytes = packetPayloadByteLength(payload);
  if (bytes > MAX_CLIENT_PACKET_BYTES) {
    return {
      ok: false,
      error: `client packet exceeded ${MAX_CLIENT_PACKET_BYTES} bytes`,
      bytes,
      tooLarge: true,
    };
  }

  let decoded: unknown;
  try {
    decoded = decodePacketPayloadSync(payload);
  } catch (error) {
    return {
      ok: false,
      error: `failed to decode packet: ${String(error)}`,
      bytes,
      tooLarge: false,
    };
  }

  const parsed = ClientMessageSchema.safeParse(decoded);
  if (!parsed.success) {
    return {
      ok: false,
      error: z.prettifyError(parsed.error),
      bytes,
      tooLarge: false,
    };
  }

  return { ok: true, message: parsed.data, bytes };
}

export function sendServerMessage(
  ws: WebSocket,
  message: ServerMessage,
): void {
  if (ws.readyState !== WebSocket.OPEN) {
    return;
  }
  ws.send(encodePacket(message), { binary: true });
}
