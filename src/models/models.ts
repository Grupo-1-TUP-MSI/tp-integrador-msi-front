export const Roles = ['ADMINISTRADOR', 'COMPRADOR', 'VENDEDOR'];

export interface Usuario {
  id?: number;
  usuario: string;
  password: string;
  rol?: string;
  idrol?: number;
  estado?: true;
}
