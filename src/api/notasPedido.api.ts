import { httpApi } from '@app/api/http.api';

export const getNotasPedidos = () => {
  return httpApi.get('np').then((res) => res.data.data);
};

export const getNotaPedido = (id: number) => {
  return httpApi.get(`np/${id}`).then((res) => res.data.data);
};

export const postNotaPedido = (np: any) => {
  return httpApi.post('np', np).then((res) => res.data.data);
};

export const putNotaPedido = (np: any) => {
  return httpApi.put(`np/${np.id}`, np).then((res) => res.data.data);
};

export const putEstado = (id: number, estado: any) => {
  return httpApi.put(`np/estado/${id}`, { idEstadoNP: estado }).then((res) => res.data.data);
};
