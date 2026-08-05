export type ChatRole = "user" | "assistant" | "error";

export type AgentActivity = {
  agentId: string;
  label: string;
  status: "started" | "working" | "completed" | "failed";
  detail?: string;
  tool?: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  /** Generic tool hint when no specialist is active. */
  toolHint?: string;
  /** Rich activity when a subagent (e.g. music specialist) is running. */
  agentActivity?: AgentActivity;
};

export type ChatEvent =
  | { event: "session"; data: { conversationId: string } }
  | { event: "delta"; data: { text: string } }
  | { event: "tool"; data: { name: string; status: "start" | "done" } }
  | {
      event: "agent";
      data: {
        status: AgentActivity["status"];
        agentId: string;
        label: string;
        detail?: string;
        tool?: string;
      };
    }
  | { event: "done"; data: { stopReason?: string | null; usage?: unknown } }
  | { event: "error"; data: { code: string; message: string } };
