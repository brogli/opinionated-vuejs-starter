<script setup lang="ts">
import Button from 'openvue/button'
import { storeToRefs } from 'pinia'
import CounterDisplay from '@/components/CounterDisplay.vue'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
const { count } = storeToRefs(counter)
</script>

<template>
  <section class="flex flex-col items-center gap-8 py-16">
    <div class="text-center">
      <h1 class="text-4xl font-semibold">Counter</h1>
      <p class="mt-2 max-w-md text-surface-500">
        State lives in a Pinia store. Navigate to
        <span class="font-medium">About</span>
        to see the same value read from another view.
      </p>
    </div>

    <div data-testid="count-home">
      <CounterDisplay :value="count" label="Count" size="lg" />
    </div>

    <Button icon="oi oi-plus" label="Increment" size="large" @click="counter.increment" />
  </section>
</template>
