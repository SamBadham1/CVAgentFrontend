<script setup lang="ts">
import { computed } from "vue";
import { parseMessageContent } from "../../lib/parseMessage";
import type { ChatMessage } from "../../lib/types";
import AgentActivityBanner from "./AgentActivityBanner.vue";
import ChartBlock from "./ChartBlock.vue";
import MessageMarkdown from "./MessageMarkdown.vue";
import styles from "./Chat.module.css";

const props = defineProps<{
  message: ChatMessage;
  isStreaming: boolean;
}>();

const roleClass = computed(() =>
  props.message.role === "user"
    ? styles.user
    : props.message.role === "error"
      ? styles.error
      : styles.assistant,
);

const showThinking = computed(
  () =>
    props.isStreaming &&
    props.message.role === "assistant" &&
    !props.message.text.trim() &&
    !props.message.agentActivity &&
    !props.message.toolHint,
);

const showCursor = computed(
  () =>
    props.isStreaming &&
    props.message.role === "assistant" &&
    !props.message.toolHint &&
    !props.message.agentActivity,
);

const segments = computed(() => {
  if (props.message.role !== "assistant" || !props.message.text) {
    return null;
  }
  return parseMessageContent(props.message.text);
});
</script>

<template>
  <div :class="[styles.bubble, roleClass]">
    <AgentActivityBanner
      v-if="message.agentActivity"
      :activity="message.agentActivity"
    />
    <span v-if="showThinking" :class="styles.thinking" aria-live="polite">
      Thinking<span :class="styles.thinkingDots" aria-hidden="true"
        ><span>.</span><span>.</span><span>.</span></span
      >
    </span>
    <template v-else-if="segments">
      <template v-for="(segment, i) in segments" :key="i">
        <ChartBlock v-if="segment.kind === 'chart'" :config="segment.config" />
        <MessageMarkdown v-else :content="segment.value" />
      </template>
    </template>
    <MessageMarkdown
      v-else-if="message.text"
      :content="message.text"
      :variant="message.role === 'user' ? 'user' : 'assistant'"
    />
    <span v-if="showCursor && !showThinking" :class="styles.typing">▌</span>
    <span
      v-if="message.toolHint && !message.agentActivity"
      :class="styles.toolHint"
    >
      Looking up {{ message.toolHint }}…
    </span>
  </div>
</template>
