import { httpApi } from './http.api';

export interface Notification {
  id: number;
  description: string;
}

export const getStockNotifications = () => {
  return httpApi.get('/reportes/stock').then((res) => res.data.data);
};
