import type { LoginRequest, LoginResponse } from '../models/auth.model';

export interface AuthRepository {
  login(payload: LoginRequest): Promise<LoginResponse>;
}
