import React from 'react';
import { FormOutlined, UserOutlined } from '@ant-design/icons';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.dashboard',
    key: 'dashboard',
    icon: <UserOutlined />,
    url: '/',
  },
  {
    title: 'common.compras',
    key: 'compras',
    icon: <FormOutlined />,
    children: [
      {
        title: 'common.proveedores',
        key: 'proveedores',
        url: '/compras/proveedores',
      },
      {
        title: 'common.notas-de-pedido',
        key: 'notas-de-pedido',
        url: '/compras/notas-de-pedido',
      },
    ],
  },
  {
    title: 'common.ventas',
    key: 'ventas',
    icon: <FormOutlined />,
    children: [
      {
        title: 'common.clientes',
        key: 'clientes',
        url: '/ventas/clientes',
      },
      {
        title: 'common.facturacion',
        key: 'facturacion',
        url: '/ventas/facturacion',
      },
    ],
  },
  {
    title: 'common.productos',
    key: 'productos',
    icon: <FormOutlined />,
    url: '/productos',
  },
  {
    title: 'common.usuarios',
    key: 'usuarios',
    icon: <FormOutlined />,
    url: '/usuarios',
  },
];
