<script setup lang="ts">
import ChatBox from "../components/chat/ChatBox.vue";
import styles from "./Pages.module.css";
</script>

<template>
  <main :class="styles.page">
    <section :class="styles.hero">
      <h1>Ask me about my experience</h1>
      <p>
        An AI assistant grounded in my CV — ask about roles, skills, or
        projects.
      </p>
    </section>
    <ChatBox />
  </main>
</template>
