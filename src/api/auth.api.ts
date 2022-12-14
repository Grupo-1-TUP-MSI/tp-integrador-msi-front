import { httpApi } from '@app/api/http.api';
import { User } from '@app/interfaces/interfaces';

export interface AuthData {
  email: string;
  password: string;
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  role: string;
  fechaExpiracion: string;
}

export const login = (loginPayload: LoginRequest): Promise<LoginResponse> => {
  return httpApi.post('auth/signin', loginPayload).then((res) => res.data);
};
