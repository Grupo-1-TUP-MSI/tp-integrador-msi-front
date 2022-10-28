import { User } from '@app/interfaces/interfaces';

export const persistToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const readToken = (): string => {
  return localStorage.getItem('token') || '';
};

export const persistRole = (role: string): void => {
  localStorage.setItem('role', role);
};

export const readRole = (): string => {
  return localStorage.getItem('role') || '';
};

export const persistExpiration = (expiration: string): void => {
  localStorage.setItem('expiration', expiration);
};

export const readExpiration = (): string => {
  return localStorage.getItem('expiration') || '';
};

export const deleteExpiration = (): void => localStorage.removeItem('expiration');
export const deleteToken = (): void => localStorage.removeItem('token');
export const deleteUser = (): void => localStorage.removeItem('user');
