import { httpApi } from '@app/api/http.api';

export const getGanancias = () => {
  return httpApi.get('ganancias').then((res) => res.data);
};

export const postGanancia = (ganancia: any) => {
  return httpApi.post('ganancias', ganancia).then((res) => res.data);
};
