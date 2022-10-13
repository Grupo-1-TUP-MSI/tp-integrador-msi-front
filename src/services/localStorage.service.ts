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

export const deleteToken = (): void => localStorage.removeItem('token');
export const deleteUser = (): void => localStorage.removeItem('user');
