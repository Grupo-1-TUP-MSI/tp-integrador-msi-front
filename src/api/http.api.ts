import axios from 'axios';
import { readToken } from '@app/services/localStorage.service';

export const httpApi = axios.create({
  baseURL: 'http://localhost:3000/',
});

httpApi.interceptors.request.use((config) => {
  config.headers = { ...config.headers, 'x-access-token': `${readToken()}` };

  return config;
});

export interface ApiErrorData {
  message: string;
}
