import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { User, CreateUserDto, UpdateUserDto, LoginDto, AuthResponse } from '../types/user.types';
import { AppError } from '@/utils/appError';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: CreateUserDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new AppError('Username already taken', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    // Create full name
    const full_name = `${data.first_name} ${data.last_name}`.trim();

    // Create user
    const user = await this.userRepository.create({
      ...data,
      password_hash,
      full_name,
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getProfile(id: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(id: string, data: UpdateUserDto): Promise<Omit<User, 'password_hash'>> {
    // Check if user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If updating email, check if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }
    }

    // If updating username, check if it's already taken
    if (data.username && data.username !== user.username) {
      const existingUser = await this.userRepository.findByUsername(data.username);
      if (existingUser) {
        throw new AppError('Username already taken', 400);
      }
    }

    // If updating password, hash it
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    // Update user
    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new AppError('Failed to update user', 500);
    }

    return this.sanitizeUser(updatedUser);
  }

  async deleteProfile(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const success = await this.userRepository.delete(id);
    if (!success) {
      throw new AppError('Failed to delete user', 500);
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
  }

  private sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
} 