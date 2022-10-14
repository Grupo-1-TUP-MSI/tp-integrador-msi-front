import { Proveedor } from './../models/models';
import { httpApi } from '@app/api/http.api';

export const getProveedores = () => {
  return httpApi.get('proveedores').then((res) => res.data.data);
};

export const getProveedor = (id: number) => {
  return httpApi.get(`proveedores/${id}`).then((res) => res.data.data);
};

export const postProveedor = (proveedor: Proveedor) => {
  return httpApi.post('proveedores', proveedor).then((res) => res.data.data);
};

export const putProveedor = (proveedor: Proveedor) => {
  return httpApi.put(`proveedores/${proveedor.id}`, proveedor).then((res) => res.data.data);
};

export const deleteProveedor = (id: number) => {
  return httpApi.delete(`proveedores/${id}`).then((res) => res.data.data);
};
