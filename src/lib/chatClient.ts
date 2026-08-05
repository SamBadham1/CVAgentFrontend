import type { ChatEvent } from "./types";
import { apiUrl } from "./apiBase";

function parseSseBlock(block: string): ChatEvent | null {
  let event = "message";
  let data = "";
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) data += line.slice(5).trim();
  }
  if (!data) return null;
  try {
    return { event, data: JSON.parse(data) } as ChatEvent;
  } catch {
    return null;
  }
}

async function* readSseStream(
  response: Response,
): AsyncGenerator<ChatEvent> {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed) {
          const parsed = parseSseBlock(trimmed);
          if (parsed) yield parsed;
        }
      }
    }

    const tail = buffer.trim();
    if (tail) {
      const parsed = parseSseBlock(tail);
      if (parsed) yield parsed;
    }
  } finally {
    reader.releaseLock();
  }
}

export class ChatRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function* streamChat(
  message: string,
  conversationId?: string,
  signal?: AbortSignal,
): AsyncGenerator<ChatEvent> {
  const res = await fetch(apiUrl("/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversationId } : {}),
    }),
    signal,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) detail = body.error;
    } catch {
      // keep default detail
    }
    throw new ChatRequestError(res.status, detail);
  }

  yield* readSseStream(res);
}

export async function checkHealth(): Promise<{
  ok: boolean;
  version?: string;
}> {
  try {
    const res = await fetch(apiUrl("/health"));
    if (!res.ok) return { ok: false };
    const json = (await res.json()) as { version?: string };
    return { ok: true, version: json.version };
  } catch {
    return { ok: false };
  }
}
