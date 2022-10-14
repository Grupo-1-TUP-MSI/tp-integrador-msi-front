export const Roles = ['ADMINISTRADOR', 'COMPRADOR', 'VENDEDOR'];

export interface Usuario {
  id?: number;
  usuario: string;
  password: string;
  rol?: string;
  idRol?: number;
  estado?: true;
}

export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  stock?: number;
  stockminimo: number;
  idProveedor?: number;
  proveedor?: string;
  estado?: boolean;
}

export interface Proveedor {
  id?: number;
  nombre: string;
  tipoiva: number;
  idtipodocumento?: number;
  documento: string;
  direccion: string;
  cp: string;
  telefono: string;
  email: string;
  estado?: boolean;
}
