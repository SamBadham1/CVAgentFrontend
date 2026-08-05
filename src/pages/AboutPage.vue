<script setup lang="ts">
import styles from "./Pages.module.css";
</script>

<template>
  <main :class="styles.page">
    <div :class="styles.prose">
      <h1>About</h1>
      <p>
        I'm a software engineer focused on building web applications, APIs, and
        internal business tools. This site hosts an AI assistant that can answer
        questions about my professional background, grounded in my CV.
      </p>
      <p>
        The assistant is powered by the Claude Agent SDK with custom tools that
        read from a structured CV, so its answers stay factual rather than
        invented.
      </p>
      <p>I have also added a sub agent that has access to my dicogs data that can answer questions about my taste in music.</p>
    </div>
  </main>
</template>
