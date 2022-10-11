export const Roles = ['Administrador', 'Comprador', 'Vendedor'];

export interface Usuario {
  id?: number;
  usuario: string;
  password: string;
  rol?: string;
  idrol?: number;
  estado?: true;
}
