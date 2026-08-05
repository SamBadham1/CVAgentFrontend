<script setup lang="ts">
import { computed } from "vue";
import type { AgentActivity } from "../../lib/types";
import styles from "./Chat.module.css";

const props = defineProps<{
  activity: AgentActivity;
}>();

const isMusic = computed(() => props.activity.agentId === "records-specialist");
const isActive = computed(
  () =>
    props.activity.status === "started" || props.activity.status === "working",
);

const statusLine = computed(() => {
  const activity = props.activity;
  switch (activity.status) {
    case "started":
      return activity.detail
        ? `Starting: ${activity.detail}`
        : "Consulting specialist…";
    case "working":
      if (activity.tool) return activity.tool;
      return activity.detail ?? "Working…";
    case "completed":
      return activity.detail ?? "Done";
    case "failed":
      return activity.detail ?? "Specialist failed";
  }
});

const bannerClass = computed(() => [
  styles.agentBanner,
  isMusic.value ? styles.agentMusic : styles.agentGeneric,
  isActive.value ? styles.agentActive : styles.agentDone,
]);
</script>

<template>
  <div :class="bannerClass" role="status" aria-live="polite">
    <span :class="styles.agentIcon" aria-hidden="true">
      {{ isMusic ? "♫" : "◎" }}
    </span>
    <span :class="styles.agentBody">
      <span :class="styles.agentLabel">{{ activity.label }}</span>
      <span :class="styles.agentDetail">{{ statusLine }}</span>
    </span>
    <span v-if="isActive" :class="styles.agentPulse" aria-hidden="true" />
  </div>
</template>
