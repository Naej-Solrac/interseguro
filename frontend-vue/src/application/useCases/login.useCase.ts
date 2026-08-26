import type { LoginRequest, LoginResponse } from '../../domain/models/auth.model';
import type { AuthRepository } from '../../domain/repositories/auth.repository';

export class LoginUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(payload: LoginRequest): Promise<LoginResponse> {
    return this.authRepository.login(payload);
  }
}
