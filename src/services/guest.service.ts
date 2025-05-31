import { GuestRepository } from '../repositories/guest.repository';
import { Guest } from '../types/user.types';
import { AppError } from '../utils/appError';
import { v4 as uuidv4 } from 'uuid';

export class GuestService {
  private guestRepository: GuestRepository;

  constructor() {
    this.guestRepository = new GuestRepository();
  }

  async createGuest(ipAddress: string, userAgent: string): Promise<Guest> {
    const sessionId = uuidv4();
    return this.guestRepository.create({
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: sessionId,
    });
  }

  async getGuest(id: string): Promise<Guest> {
    const guest = await this.guestRepository.findById(id);
    if (!guest) {
      throw new AppError('Guest not found', 404);
    }
    return guest;
  }

  async getGuestBySessionId(sessionId: string): Promise<Guest> {
    const guest = await this.guestRepository.findBySessionId(sessionId);
    if (!guest) {
      throw new AppError('Guest not found', 404);
    }
    return guest;
  }

  async deleteGuest(id: string): Promise<void> {
    const success = await this.guestRepository.delete(id);
    if (!success) {
      throw new AppError('Failed to delete guest', 500);
    }
  }
} 