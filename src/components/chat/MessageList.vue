<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import type { ChatMessage } from "../../lib/types";
import MessageBubble from "./MessageBubble.vue";
import styles from "./Chat.module.css";

const STARTER_PROMPTS = [
  "What is Sam's work history?",
  "What tech stacks has he worked with?",
  "What is Sam's taste in music like?",
];

const props = defineProps<{
  messages: ChatMessage[];
  isStreaming: boolean;
  promptsDisabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "select-prompt", text: string): void;
}>();

const listEl = ref<HTMLDivElement | null>(null);

watch(
  () => props.messages,
  async () => {
    await nextTick();
    const el = listEl.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  },
  { deep: true },
);
</script>

<template>
  <div ref="listEl" :class="styles.messageList">
    <div v-if="messages.length === 0" :class="styles.empty">
      <p :class="styles.emptyLead">
        Ask me anything about Sam's experience, skills, or music collection.
      </p>
      <div :class="styles.starterPrompts">
        <button
          v-for="prompt in STARTER_PROMPTS"
          :key="prompt"
          type="button"
          :class="styles.starterBtn"
          :disabled="promptsDisabled"
          @click="emit('select-prompt', prompt)"
        >
          {{ prompt }}
        </button>
      </div>
    </div>
    <template v-else>
      <MessageBubble
        v-for="(msg, index) in messages"
        :key="msg.id"
        :message="msg"
        :is-streaming="isStreaming && index === messages.length - 1"
      />
    </template>
  </div>
</template>
