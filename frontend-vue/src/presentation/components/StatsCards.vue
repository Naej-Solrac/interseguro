<script setup lang="ts">
import { computed } from 'vue';
import type { MatrixStats } from '../../domain/models/matrix.model';

const props = defineProps<{
  qStats: MatrixStats;
  rStats: MatrixStats;
}>();

const formatValue = (value: number) => Number(value).toFixed(4);

const cardData = computed(() => [
  {
    title: 'Matriz Q',
    stats: props.qStats,
  },
  {
    title: 'Matriz R',
    stats: props.rStats,
  },
]);
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <article
      v-for="card in cardData"
      :key="card.title"
      class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <h3 class="text-lg font-semibold text-slate-900">{{ card.title }}</h3>
      <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-xl bg-slate-50 p-3">
          <dt class="text-slate-500">Max</dt>
          <dd class="font-semibold text-slate-800">{{ formatValue(card.stats.max) }}</dd>
        </div>
        <div class="rounded-xl bg-slate-50 p-3">
          <dt class="text-slate-500">Min</dt>
          <dd class="font-semibold text-slate-800">{{ formatValue(card.stats.min) }}</dd>
        </div>
        <div class="rounded-xl bg-slate-50 p-3">
          <dt class="text-slate-500">Promedio</dt>
          <dd class="font-semibold text-slate-800">{{ formatValue(card.stats.avg) }}</dd>
        </div>
        <div class="rounded-xl bg-slate-50 p-3">
          <dt class="text-slate-500">Suma</dt>
          <dd class="font-semibold text-slate-800">{{ formatValue(card.stats.sum) }}</dd>
        </div>
      </dl>
      <p class="mt-4 text-sm text-slate-600">
        ¿Diagonal?:
        <span class="font-semibold" :class="card.stats.isDiagonal ? 'text-emerald-600' : 'text-amber-600'">
          {{ card.stats.isDiagonal ? 'Sí' : 'No' }}
        </span>
      </p>
    </article>
  </div>
</template>
