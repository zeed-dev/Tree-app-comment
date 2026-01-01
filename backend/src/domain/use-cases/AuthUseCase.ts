import { IAuthUseCase, RegisterRequest, LoginRequest, AuthResponse } from '../../ports/primary/IAuthUseCase';
import { IUserRepository } from '../../ports/secondary/IUserRepository';
import { generateToken } from '../../adapters/primary/http/middleware/auth';

export class AuthUseCase implements IAuthUseCase {
  constructor(private userRepository: IUserRepository) {}

  async register(request: RegisterRequest): Promise<AuthResponse> {
    if (!request.username || !request.password) {
      throw new Error('Username and password are required');
    }

    if (request.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const existingUser = await this.userRepository.findByUsername(request.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Dynamic import untuk handle ES modules
    const bcrypt = await import('bcryptjs');
    const bcryptModule = bcrypt.default || bcrypt;
    const hashedPassword = await bcryptModule.hash(request.password, 10);
    const user = await this.userRepository.create(request.username, hashedPassword);

    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    if (!request.username || !request.password) {
      throw new Error('Username and password are required');
    }

    const user = await this.userRepository.findByUsername(request.username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Dynamic import untuk handle ES modules
    const bcrypt = await import('bcryptjs');
    const bcryptModule = bcrypt.default || bcrypt;
    const isValid = await bcryptModule.compare(request.password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}

