// User-related interfaces and types

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  message: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  message: string;
}

export interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface FormTouched {
  username?: boolean;
  password?: boolean;
  email?: boolean;
  firstName?: boolean;
  lastName?: boolean;
}
