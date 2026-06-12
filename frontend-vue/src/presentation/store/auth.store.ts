import { defineStore } from 'pinia';
import { AuthApiRepository } from '../../infrastructure/repositories/authApi.repository';
import { LoginUseCase } from '../../application/useCases/login.useCase';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const authRepository = new AuthApiRepository();
const loginUseCase = new LoginUseCase(authRepository);

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('auth_token'),
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const result = await loginUseCase.execute({ username, password });
        this.token = result.token;
        localStorage.setItem('auth_token', result.token);
      } catch (error: any) {
        this.error = error?.response?.data?.error ?? 'No se pudo iniciar sesión';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      localStorage.removeItem('auth_token');
    },
  },
});
