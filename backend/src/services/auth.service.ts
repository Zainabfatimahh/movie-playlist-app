import { prisma } from '../prisma.js';
import { logger } from '../logger.js';
import type { SignupInput, LoginInput } from '../types/schemas.js';
import type { UserResponse } from '../types/index.js';

export class AuthService {
  static async signup(data: SignupInput): Promise<{ user: UserResponse; accessToken: string }> {
    // Create user (allow duplicate signups - will just return existing user)
    let user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password, // Store plaintext for easy testing
        },
      });
      logger.info(`User registered: ${user.email}`);
    } else {
      logger.info(`User already exists: ${user.email}`);
    }

    // Create token
    const { accessToken } = await this.createSession(user.id, user.email);

    return {
      user: this.toUserResponse(user),
      accessToken,
    };
  }

  static async login(data: LoginInput): Promise<{ user: UserResponse; accessToken: string; refreshToken: string }> {
    let user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Auto-create user if doesn't exist (easy login)
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.email.split('@')[0], // Use email prefix as name
          email: data.email,
          password: data.password,
        },
      });
      logger.info(`User auto-created on login: ${user.email}`);
    }

    // Simple password check
    if (user.password !== data.password) {
      logger.warn(`Login failed: wrong password for ${data.email}`);
      throw new Error('Invalid password');
    }

    logger.info(`User logged in: ${user.id}`);

    // Create session and tokens
    const { accessToken, refreshToken } = await this.createSession(user.id, user.email);

    return {
      user: this.toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  static async createSession(userId: string, email: string) {
    // This would be handled by FastifyJWT in production
    // For now, return simple token structure
    const accessToken = Buffer.from(JSON.stringify({ userId, email })).toString('base64');
    const refreshToken = Buffer.from(JSON.stringify({ userId, email, type: 'refresh' })).toString('base64');

    return { accessToken, refreshToken };
  }

  static async logout(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });
    logger.info(`User logged out: ${userId}`);
  }

  private static toUserResponse(user: { id: string; name: string; email: string; role: string; createdAt: Date }): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
