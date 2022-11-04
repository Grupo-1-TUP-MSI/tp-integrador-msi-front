import { Usuario } from './../models/models';
import { httpApi } from '@app/api/http.api';

export const getUsuarios = () => {
  return httpApi.get('usuarios').then((res) => res.data.data);
};

export const getUsuario = (id: number) => {
  return httpApi.get(`usuarios/${id}`).then((res) => res.data.data);
};

export const postUsuario = (usuario: any) => {
  return httpApi.post('usuarios', usuario).then((res) => res.data.data);
};

export const putUsuario = (usuario: any) => {
  const user = {
    usuario: usuario.usuario,
    nombrecompleto: usuario.nombrecompleto,
    password: usuario.password,
    idRol: usuario.idRol,
  };
  return httpApi.put(`usuarios/${usuario.id}`, user).then((res) => res.data.data);
};

export const deleteUsuario = (id: number) => {
  return httpApi.delete(`usuarios/${id}`).then((res) => res.data.data);
};
