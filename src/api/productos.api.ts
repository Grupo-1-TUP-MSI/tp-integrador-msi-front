import { Producto } from './../models/models';
import { httpApi } from '@app/api/http.api';

export const getProductos = () => {
  return httpApi.get('productos').then((res) => res.data.data);
};

export const getProducto = (id: number) => {
  return httpApi.get(`productos/${id}`).then((res) => res.data.data);
};

export const postProducto = (producto: Producto) => {
  return httpApi.post('productos', producto).then((res) => res.data.data);
};

export const putProducto = (producto: Producto) => {
  return httpApi.put(`productos/${producto.id}`, producto).then((res) => res.data.data);
};

export const deleteProducto = (id: number) => {
  return httpApi.delete(`productos/${id}`).then((res) => res.data.data);
};

export const updateStock = (id: number, stock: number) => {
  return httpApi.put(`productos/${id}/stock`, { stock }).then((res) => res.data.data);
};
