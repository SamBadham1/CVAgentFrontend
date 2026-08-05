import type { ChartJsConfig } from "./chartTypes";

export type MessageSegment =
  | { kind: "text"; value: string }
  | { kind: "chart"; config: ChartJsConfig };

const CHART_FENCE = /```chart\s*\n([\s\S]*?)\n```/g;

function tryParseChart(raw: string): ChartJsConfig | null {
  try {
    const parsed = JSON.parse(raw.trim()) as ChartJsConfig;
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.type === "string" &&
      parsed.data &&
      Array.isArray(parsed.data.labels) &&
      Array.isArray(parsed.data.datasets)
    ) {
      return parsed;
    }
  } catch {
    /* incomplete or invalid JSON during streaming */
  }
  return null;
}

/** Split assistant message text into prose and Chart.js config blocks. */
export function parseMessageContent(text: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(CHART_FENCE)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      const chunk = text.slice(lastIndex, start);
      if (chunk.trim()) {
        segments.push({ kind: "text", value: chunk });
      }
    }

    const config = tryParseChart(match[1]);
    if (config) {
      segments.push({ kind: "chart", config });
    } else {
      segments.push({ kind: "text", value: match[0] });
    }

    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    const tail = text.slice(lastIndex);
    if (tail.trim()) {
      segments.push({ kind: "text", value: tail });
    }
  }

  if (segments.length === 0 && text) {
    segments.push({ kind: "text", value: text });
  }

  return segments;
}
