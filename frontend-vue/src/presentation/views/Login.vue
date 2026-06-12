<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  username: '',
  password: '',
});

const submit = async () => {
  try {
    await authStore.login(form.username, form.password);
    await router.push({ name: 'dashboard' });
  } catch {
    // El error se pinta desde el store
  }
};
</script>

<template>
  <main class="flex min-h-screen items-center justify-center p-6">
    <section class="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <h1 class="text-2xl font-bold text-slate-900">Matrix Challenge</h1>
      <p class="mt-1 text-sm text-slate-600">Inicia sesión para procesar matrices con QR.</p>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Usuario</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            required
          />
        </div>

        <p v-if="authStore.error" class="text-sm text-rose-600">{{ authStore.error }}</p>

        <button
          type="submit"
          class="w-full rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </section>
  </main>
</template>
