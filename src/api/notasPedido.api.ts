import { NotaPedido } from './../models/models';
import { httpApi } from '@app/api/http.api';

export const getNotasPedidos = () => {
  return httpApi.get('np').then((res) => res.data.data);
};

export const getNotaPedido = (id: number) => {
  console.log(id);
  return httpApi.get(`np/${id}`).then((res) => res.data.data);
};

export const postNotaPedido = (np: NotaPedido) => {
  return httpApi.post('np', np).then((res) => res.data.data);
};

export const putNotaPedido = (np: NotaPedido) => {
  return httpApi.put(`np/${np.id}`, np).then((res) => res.data.data);
};

export const deleteNotaPedido = (id: number) => {
  return httpApi.delete(`np/${id}`).then((res) => res.data.data);
};

export const putEstado = (id: number, estado: any) => {
  return httpApi.put(`np/estado/${id}`, { estado }).then((res) => res.data.data);
};
