export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  password_hash: string;
  is_verified: boolean;
  created_at: Date;
}

export interface UserVerification {
  id: string;
  user_id: string;
  provider: 'twitter' | 'linkedin';
  verified_at: Date;
}

export interface Guest {
  id: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  session_id: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  phone?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  password?: string;
  is_verified?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: Date;
} 