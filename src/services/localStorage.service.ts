import { User } from '@app/interfaces/interfaces';

export const persistToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const readToken = (): string => {
  return localStorage.getItem('token') || '';
};

export const persistUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const readUser = (): User | null => {
  const userStr = localStorage.getItem('user');

  return userStr ? JSON.parse(userStr) : null;
};

export const deleteToken = (): void => localStorage.removeItem('token');
export const deleteUser = (): void => localStorage.removeItem('user');
