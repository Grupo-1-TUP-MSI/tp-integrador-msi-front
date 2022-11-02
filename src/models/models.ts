export const Roles = ['ADMINISTRADOR', 'COMPRADOR', 'VENDEDOR'];
export const TiposPago = ['EFECTIVO', 'MERCADOPAGO'];
export const TipoVenta = ['SALON', 'ONLINE'];
export const TipoCompra = ['LOCAL', 'EXTERIOR'];
export const TiposDocumento = ['DNI', 'CUIT', 'CUIL', 'PASAPORTE'];
export const EstadoNP = ['PEND_ACEPTACION', 'PEND_ENTREGA', 'CERRADA', 'RECHAZADA'];
export const TiposIVA = ['Responsable Inscripto', 'Monotributista', 'Consumidor Final'];

export interface Usuario {
  id?: number;
  usuario: string;
  nombrecompleto: string;
  password: string;
  rol?: string;
  idRol?: number;
  estado?: true;
}

export interface Producto {
  id?: number;
  nombre: string;
  preciolista: number;
  stock?: number;
  stockminimo: number;
  idProveedor?: number;
  proveedor?: string;
  estado?: boolean;
}

export interface Cliente {
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
