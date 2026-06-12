<script setup lang="ts">
import { useRouter } from 'vue-router';
import MatrixInput from '../components/MatrixInput.vue';
import MatrixTable from '../components/MatrixTable.vue';
import StatsCards from '../components/StatsCards.vue';
import { useAuthStore } from '../store/auth.store';
import { useMatrixStore } from '../store/matrix.store';

const authStore = useAuthStore();
const matrixStore = useMatrixStore();
const router = useRouter();

const onProcess = async (matrix: number[][]) => {
  try {
    await matrixStore.processMatrix(matrix);
  } catch {
    // El error se maneja desde el store
  }
};

const logout = async () => {
  authStore.logout();
  matrixStore.clearResult();
  await router.push({ name: 'login' });
};
</script>

<template>
  <main class="min-h-screen p-6">
    <div class="mx-auto max-w-6xl space-y-6">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Dashboard QR</h1>
          <p class="text-sm text-slate-600">Procesa matrices y revisa estadísticas de Q y R.</p>
        </div>
        <button
          type="button"
          class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          @click="logout"
        >
          Cerrar sesión
        </button>
      </header>

      <MatrixInput @submit="onProcess" />

      <p v-if="matrixStore.loading" class="text-sm text-slate-600">Procesando matriz...</p>
      <p v-if="matrixStore.error" class="text-sm text-rose-600">{{ matrixStore.error }}</p>

      <template v-if="matrixStore.result">
        <StatsCards
          :q-stats="matrixStore.result.statistics.Q"
          :r-stats="matrixStore.result.statistics.R"
        />

        <div class="grid gap-4 lg:grid-cols-2">
          <MatrixTable title="Matriz Q" :matrix="matrixStore.result.qr_factorization.Q" />
          <MatrixTable title="Matriz R" :matrix="matrixStore.result.qr_factorization.R" />
        </div>
      </template>
    </div>
  </main>
</template>
