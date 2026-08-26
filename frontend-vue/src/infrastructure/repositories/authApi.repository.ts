import type { AuthRepository } from '../../domain/repositories/auth.repository';
import type { LoginRequest, LoginResponse } from '../../domain/models/auth.model';
import { apiClient } from '../api/apiClient';

export class AuthApiRepository implements AuthRepository {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  }
}
