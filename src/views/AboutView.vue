<script setup lang="ts">
import Button from 'openvue/button'
import Card from 'openvue/card'
import { storeToRefs } from 'pinia'
import CounterDisplay from '@/components/CounterDisplay.vue'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
const { count, doubleCount } = storeToRefs(counter)
</script>

<template>
  <section class="flex flex-col gap-8 py-16">
    <div>
      <h1 class="text-4xl font-semibold">Stats</h1>
      <p class="mt-2 text-surface-500">
        Both values below read from the same Pinia store as the Home view.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <Card>
        <template #content>
          <div data-testid="count-about">
            <CounterDisplay :value="count" label="Count" />
          </div>
        </template>
      </Card>
      <Card>
        <template #content>
          <div data-testid="double-about">
            <CounterDisplay :value="doubleCount" label="Double" />
          </div>
        </template>
      </Card>
    </div>

    <div>
      <Button
        icon="oi oi-refresh"
        label="Reset"
        severity="secondary"
        outlined
        @click="counter.reset"
      />
    </div>
  </section>
</template>
