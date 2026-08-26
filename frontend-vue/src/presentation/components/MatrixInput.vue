<script setup lang="ts">
import { ref } from 'vue';

const rawMatrix = ref('[[1,2],[3,4],[5,6]]');
const inputError = ref<string | null>(null);

const emit = defineEmits<{
  submit: [matrix: number[][]];
}>();

const parseMatrix = () => {
  inputError.value = null;

  try {
    const parsed = JSON.parse(rawMatrix.value);

    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(Array.isArray)) {
      throw new Error('Debe ser un array de arrays');
    }

    const width = parsed[0].length;
    if (width === 0 || !parsed.every((row) => row.length === width)) {
      throw new Error('La matriz debe ser rectangular');
    }

    if (!parsed.every((row) => row.every((value: unknown) => typeof value === 'number'))) {
      throw new Error('Todos los valores deben ser numéricos');
    }

    emit('submit', parsed as number[][]);
  } catch (error: any) {
    inputError.value = error?.message ?? 'Formato inválido';
  }
};
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <h2 class="text-lg font-semibold text-slate-900">Ingresar matriz</h2>
    <p class="mt-1 text-sm text-slate-600">
      Pega un JSON con matriz rectangular, por ejemplo: [[1,2],[3,4],[5,6]]
    </p>

    <textarea
      v-model="rawMatrix"
      rows="6"
      class="mt-4 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
    />

    <p v-if="inputError" class="mt-3 text-sm text-rose-600">{{ inputError }}</p>

    <button
      type="button"
      class="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
      @click="parseMatrix"
    >
      Procesar matriz
    </button>
  </section>
</template>
