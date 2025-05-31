import prisma from '../lib/prisma';
import { User, CreateUserDto, UpdateUserDto } from '../types/user.types';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async create(data: CreateUserDto & { password_hash: string; full_name: string }): Promise<User> {
    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        phone: data.phone,
        firstName: data.first_name,
        middleName: data.middle_name,
        lastName: data.last_name,
        fullName: data.full_name,
        passwordHash: data.password_hash,
        isVerified: false,
      },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const updateData: any = {};
    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.first_name) updateData.firstName = data.first_name;
    if (data.middle_name) updateData.middleName = data.middle_name;
    if (data.last_name) updateData.lastName = data.last_name;
    if (data.password) updateData.passwordHash = data.password;
    if (typeof data.is_verified === 'boolean') updateData.isVerified = data.is_verified;

    if (data.first_name || data.last_name) {
      updateData.fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim();
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByCondition(condition: { [key: string]: any }): Promise<User[]> {
    return prisma.user.findMany({
      where: condition,
    });
  }

  async findOneByCondition(condition: { [key: string]: any }): Promise<User | null> {
    return prisma.user.findFirst({
      where: condition,
    });
  }

  async updateByCondition(condition: { [key: string]: any }, data: UpdateUserDto): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: condition,
    });

    const updatedUsers = await Promise.all(
      users.map((user: User) => this.update(user.id, data))
    );

    return updatedUsers.filter((user): user is User => user !== null);
  }

  async deleteByCondition(condition: { [key: string]: any }): Promise<boolean> {
    try {
      await prisma.user.deleteMany({
        where: condition,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 