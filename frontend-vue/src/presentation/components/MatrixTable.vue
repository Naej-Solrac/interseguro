<script setup lang="ts">
import type { Matrix } from '../../domain/models/matrix.model';

defineProps<{
  title: string;
  matrix: Matrix;
}>();
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
    <div class="mt-4 overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <tbody class="divide-y divide-slate-100">
          <tr v-for="(row, rowIndex) in matrix" :key="`row-${rowIndex}`">
            <td
              v-for="(value, colIndex) in row"
              :key="`cell-${rowIndex}-${colIndex}`"
              class="whitespace-nowrap px-3 py-2 text-sm text-slate-700"
            >
              {{ Number(value).toFixed(4) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
