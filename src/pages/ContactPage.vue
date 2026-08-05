<script setup lang="ts">
import styles from "./Pages.module.css";
</script>

<template>
  <main :class="styles.page">
    <div :class="styles.prose">
      <h1>Contact</h1>
      <p>Get in touch through any of the channels below.</p>
      <ul :class="styles.contactList">
        <li>
          <a href="mailto:samuel.badham@yahoo.co.nz">samuel.badham@yahoo.co.nz</a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/sam-badham-b41404104/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </div>
  </main>
</template>
