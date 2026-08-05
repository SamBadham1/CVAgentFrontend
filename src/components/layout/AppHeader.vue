<script setup lang="ts">
import styles from "./Header.module.css";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];
</script>

<template>
  <header :class="styles.header">
    <RouterLink to="/" :class="styles.brand">CV Agent</RouterLink>
    <nav :class="styles.nav" aria-label="Main navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="styles.link"
        :exact-active-class="styles.active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>
