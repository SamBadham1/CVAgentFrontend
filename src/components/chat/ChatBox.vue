<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { checkHealth } from "../../lib/chatClient";
import { useChat } from "../../composables/useChat";
import MessageList from "./MessageList.vue";
import ChatInput from "./ChatInput.vue";
import styles from "./Chat.module.css";

type BackendStatus = "checking" | "ok" | "offline";

const { messages, isStreaming, send } = useChat();
const status = ref<BackendStatus>("checking");
const inputValue = ref("");

const inputDisabled = computed(
  () => isStreaming.value || status.value === "offline",
);

onMounted(() => {
  void checkHealth().then(({ ok }) => {
    status.value = ok ? "ok" : "offline";
  });
});

const statusDotClass = computed(() => {
  if (status.value === "ok") return `${styles.statusDot} ${styles.ok}`;
  if (status.value === "offline") return `${styles.statusDot} ${styles.error}`;
  return styles.statusDot;
});
</script>

<template>
  <div :class="styles.chatBox">
    <div :class="styles.statusBar">
      <span :class="statusDotClass" />
      <template v-if="status === 'checking'">Connecting…</template>
      <template v-else-if="status === 'ok'">Online</template>
      <template v-else>Backend offline — start the API server</template>
    </div>
    <MessageList
      :messages="messages"
      :is-streaming="isStreaming"
      :prompts-disabled="inputDisabled"
      @select-prompt="inputValue = $event"
    />
    <ChatInput
      v-model="inputValue"
      :disabled="inputDisabled"
      @send="send"
    />
  </div>
</template>
