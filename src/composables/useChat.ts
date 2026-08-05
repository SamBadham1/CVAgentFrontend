import { onUnmounted, ref, type Ref } from "vue";
import { ChatRequestError, streamChat } from "../lib/chatClient";
import type { AgentActivity, ChatMessage } from "../lib/types";

const CONVERSATION_KEY = "cvagent.conversationId";

let nextId = 0;
function makeId(): string {
  nextId += 1;
  return `msg-${Date.now()}-${nextId}`;
}

export type UseChatResult = {
  messages: Ref<ChatMessage[]>;
  isStreaming: Ref<boolean>;
  send: (text: string) => void;
};

export function useChat(): UseChatResult {
  const messages = ref<ChatMessage[]>([]);
  const isStreaming = ref(false);
  let abortController: AbortController | null = null;

  onUnmounted(() => abortController?.abort());

  const patchMessage = (
    id: string,
    patch: (msg: ChatMessage) => ChatMessage,
  ) => {
    messages.value = messages.value.map((m) => (m.id === id ? patch(m) : m));
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming.value) return;

    abortController?.abort();
    const controller = new AbortController();
    abortController = controller;

    const userMsg: ChatMessage = { id: makeId(), role: "user", text: trimmed };
    const assistantId = makeId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      text: "",
    };
    messages.value = [...messages.value, userMsg, assistantMsg];
    isStreaming.value = true;

    void (async () => {
      const conversationId =
        sessionStorage.getItem(CONVERSATION_KEY) ?? undefined;

      try {
        for await (const { event, data } of streamChat(
          trimmed,
          conversationId,
          controller.signal,
        )) {
          if (event === "session") {
            sessionStorage.setItem(CONVERSATION_KEY, data.conversationId);
          } else if (event === "delta") {
            patchMessage(assistantId, (m) => ({
              ...m,
              text: m.text + data.text,
              toolHint: undefined,
              agentActivity:
                m.agentActivity?.status === "working" ||
                m.agentActivity?.status === "started"
                  ? undefined
                  : m.agentActivity,
            }));
          } else if (event === "agent") {
            const activity: AgentActivity = {
              agentId: data.agentId,
              label: data.label,
              status: data.status,
              detail: data.detail,
              tool: data.tool,
            };
            patchMessage(assistantId, (m) => ({
              ...m,
              toolHint: undefined,
              agentActivity:
                data.status === "completed" || data.status === "failed"
                  ? { ...activity }
                  : activity,
            }));
            // Clear completed/failed banner after a short pause.
            if (data.status === "completed" || data.status === "failed") {
              setTimeout(() => {
                patchMessage(assistantId, (m) =>
                  m.agentActivity?.status === data.status
                    ? { ...m, agentActivity: undefined }
                    : m,
                );
              }, 2500);
            }
          } else if (event === "tool") {
            patchMessage(assistantId, (m) =>
              m.agentActivity
                ? m
                : {
                    ...m,
                    toolHint: data.status === "start" ? data.name : undefined,
                  },
            );
          } else if (event === "error") {
            patchMessage(assistantId, (m) =>
              m.text.trim()
                ? { ...m, toolHint: undefined, agentActivity: undefined }
                : {
                    ...m,
                    role: "error",
                    text: data.message,
                    toolHint: undefined,
                    agentActivity: undefined,
                  },
            );
          } else if (event === "done") {
            patchMessage(assistantId, (m) => ({
              ...m,
              text: m.text.trim() ? m.text : "(No response text)",
              toolHint: undefined,
              agentActivity: undefined,
            }));
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof ChatRequestError
            ? err.message
            : "Could not reach the server. Is the backend running?";
        patchMessage(assistantId, (m) => ({
          ...m,
          role: "error",
          text: message,
          toolHint: undefined,
        }));
      } finally {
        if (!controller.signal.aborted) {
          isStreaming.value = false;
        }
      }
    })();
  };

  return { messages, isStreaming, send };
}
