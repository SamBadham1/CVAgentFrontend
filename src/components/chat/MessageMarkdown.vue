<script setup lang="ts">
import { computed } from "vue";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import styles from "./Chat.module.css";

const md = new MarkdownIt({
  html: false,
  linkify: true,
});

const props = withDefaults(
  defineProps<{
    content: string;
    variant?: "assistant" | "user";
  }>(),
  { variant: "assistant" },
);

const wrapperClass = computed(() =>
  props.variant === "user"
    ? [styles.prose, styles.proseUser]
    : [styles.prose],
);

const html = computed(() => DOMPurify.sanitize(md.render(props.content)));
</script>

<template>
  <div :class="wrapperClass" v-html="html" />
</template>
