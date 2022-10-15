import { Cliente } from './../models/models';
import { httpApi } from '@app/api/http.api';

export const getClientes = () => {
  return httpApi.get('clientes').then((res) => res.data.data);
};

export const getCliente = (id: number) => {
  return httpApi.get(`clientes/${id}`).then((res) => res.data.data);
};

export const postCliente = (client: Cliente) => {
  return httpApi.post('clientes', client).then((res) => res.data.data);
};

export const putCliente = (client: Cliente) => {
  return httpApi.put(`clientes/${client.id}`, client).then((res) => res.data.data);
};

export const deleteCliente = (id: number) => {
  return httpApi.delete(`clientes/${id}`).then((res) => res.data.data);
};
