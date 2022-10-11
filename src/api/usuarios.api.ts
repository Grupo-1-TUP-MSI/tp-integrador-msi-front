import { Usuario } from './../models/models';
import { httpApi } from '@app/api/http.api';

export const getUsuarios = () => {
  return httpApi.get('usuarios').then((res) => res.data.data);
};

export const getUsuario = (id: number) => {
  return httpApi.get(`usuarios/${id}`).then((res) => res.data.data);
};

export const postUsuario = (usuario: Usuario) => {
  return httpApi.post('usuarios', usuario).then((res) => res.data.data);
};

export const putUsuario = (usuario: Usuario) => {
  return httpApi.put(`usuarios/${usuario.id}`, usuario).then((res) => res.data.data);
};

export const deleteUsuario = (id: number) => {
  return httpApi.delete(`usuarios/${id}`).then((res) => res.data.data);
};
