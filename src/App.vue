<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
useTitle(() => route.meta.title, { titleTemplate: '%s · opinionated vuejs starter' })
</script>

<template>
  <div class="min-h-screen bg-surface-0 text-surface-900 dark:bg-surface-950 dark:text-surface-0">
    <header class="border-b border-surface-200 dark:border-surface-800">
      <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span class="text-lg font-semibold">vuejs-scaffold</span>
        <div class="flex gap-6 text-sm">
          <RouterLink
            to="/"
            class="hover:text-primary"
            exact-active-class="text-primary font-semibold"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/about"
            class="hover:text-primary"
            exact-active-class="text-primary font-semibold"
          >
            About
          </RouterLink>
        </div>
      </nav>
    </header>
    <main class="mx-auto max-w-5xl px-6">
      <RouterView />
    </main>
  </div>
</template>
