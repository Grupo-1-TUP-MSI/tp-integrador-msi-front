export const Roles = ['ADMINISTRADOR', 'COMPRADOR', 'VENDEDOR'];

export interface Usuario {
  id?: number;
  usuario: string;
  password: string;
  rol?: string;
  idRol?: number;
  estado?: true;
}
