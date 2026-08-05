<script setup lang="ts">
import styles from "./Chat.module.css";

const props = defineProps<{
  disabled: boolean;
}>();

const model = defineModel<string>({ required: true });

const emit = defineEmits<{
  (e: "send", text: string): void;
}>();

const submit = () => {
  const text = model.value.trim();
  if (!text || props.disabled) return;
  model.value = "";
  emit("send", text);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submit();
  }
};
</script>

<template>
  <form :class="styles.inputForm" @submit.prevent="submit">
    <textarea
      v-model="model"
      :class="styles.textarea"
      :rows="1"
      placeholder="Ask about experience, skills, projects…"
      aria-label="Chat message"
      @keydown="handleKeyDown"
    />
    <button
      :class="styles.sendBtn"
      type="submit"
      :disabled="disabled || !model.trim()"
    >
      Send
    </button>
  </form>
</template>
