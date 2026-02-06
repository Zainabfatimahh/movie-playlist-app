import { hash, verify } from 'argon2';
import { prisma } from '../prisma.js';
import { logger } from '../logger.js';
import type { SignupInput, LoginInput } from '../types/schemas.js';
import type { UserResponse } from '../types/index.js';

export class AuthService {
  static async signup(data: SignupInput): Promise<{ user: UserResponse; accessToken: string }> {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hash(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    logger.info(`User created: ${user.id}`);

    // Create session and tokens
    const { accessToken } = await this.createSession(user.id, user.email);

    return {
      user: this.toUserResponse(user),
      accessToken,
    };
  }

  static async login(data: LoginInput): Promise<{ user: UserResponse; accessToken: string; refreshToken: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await verify(user.password, data.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
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
