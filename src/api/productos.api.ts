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

export const agregarProveedores = (idProducto: number, idProveedor: number, nuevoPrecio: number) => {
  return httpApi
    .put(`productosproveedores`, { idproducto: idProducto, idproveedor: idProveedor, precio: nuevoPrecio })
    .then((res) => res.data.data);
};

export const getProductosDeProveedor = (idProveedor: number) => {
  return httpApi.get(`productos/proveedor/${idProveedor}`).then((res) => res.data.data);
};

export const getProductosComparativa = () => {
  return httpApi
    .get('productos/comparativa')
    .then((res) => res.data.data.map((p: any) => ({ ...p, id: p.idproducto + '-' + p.idproveedor })));
};
