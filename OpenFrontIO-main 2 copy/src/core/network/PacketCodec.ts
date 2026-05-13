import { pack, unpack } from "msgpackr";

export const NETWORK_PACKET_FORMAT = "dominion-msgpack-v1";
export const MAX_CLIENT_PACKET_BYTES = 64 * 1024;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export type PacketPayload =
  | string
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | readonly ArrayBufferView[];

export function encodePacket(message: unknown): Uint8Array {
  return pack(message);
}

export function packetPayloadByteLength(payload: PacketPayload): number {
  if (typeof payload === "string") {
    return textEncoder.encode(payload).byteLength;
  }
  if (payload instanceof ArrayBuffer) {
    return payload.byteLength;
  }
  if (typeof Blob !== "undefined" && payload instanceof Blob) {
    return payload.size;
  }
  if (ArrayBuffer.isView(payload)) {
    return payload.byteLength;
  }
  if (Array.isArray(payload)) {
    return payload.reduce((sum, part) => sum + part.byteLength, 0);
  }
  return 0;
}

export async function decodePacketPayload(payload: PacketPayload): Promise<unknown> {
  if (typeof Blob !== "undefined" && payload instanceof Blob) {
    return decodePacketPayloadSync(await payload.arrayBuffer());
  }
  return decodePacketPayloadSync(payload as Exclude<PacketPayload, Blob>);
}

export function decodePacketPayloadSync(payload: Exclude<PacketPayload, Blob>): unknown {
  if (typeof payload === "string") {
    return JSON.parse(payload);
  }
  if (payload instanceof ArrayBuffer) {
    return decodeBinaryPacket(new Uint8Array(payload));
  }
  if (ArrayBuffer.isView(payload)) {
    return decodeBinaryPacket(
      new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength),
    );
  }
  if (Array.isArray(payload)) {
    return decodeBinaryPacket(concatPacketParts(payload));
  }
  throw new Error("Unsupported packet payload type");
}

function decodeBinaryPacket(bytes: Uint8Array): unknown {
  try {
    return unpack(bytes);
  } catch (error) {
    const text = textDecoder.decode(bytes).trim();
    if (text.startsWith("{") || text.startsWith("[")) {
      return JSON.parse(text);
    }
    throw error;
  }
}

function concatPacketParts(parts: readonly ArrayBufferView[]): Uint8Array {
  const totalBytes = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const out = new Uint8Array(totalBytes);
  let offset = 0;
  for (const part of parts) {
    const bytes = new Uint8Array(part.buffer, part.byteOffset, part.byteLength);
    out.set(bytes, offset);
    offset += bytes.byteLength;
  }
  return out;
}
