import React from 'react';
import { DashboardOutlined, ShopOutlined, ShoppingCartOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const adminSidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.dashboard',
    key: 'dashboard',
    icon: <DashboardOutlined />,
    url: '/',
  },
  {
    title: 'common.compras',
    key: 'compras',
    icon: <ShoppingCartOutlined />,
    children: [
      {
        title: 'common.comprar',
        key: 'notapedido/alta',
        url: '/compras/notapedido/alta',
      },
      {
        title: 'common.listado',
        key: 'notapedido',
        url: '/compras/notapedido',
      },
      {
        title: 'common.comparativaProveedores',
        key: 'proveedores/comparativa',
        url: '/compras/proveedores/comparativa',
      },
      {
        title: 'common.proveedores',
        key: 'proveedores',
        url: '/compras/proveedores',
      },
    ],
  },
  {
    title: 'common.ventas',
    key: 'ventas',
    icon: <ShopOutlined />,
    children: [
      {
        title: 'common.vender',
        key: 'facturacion/alta',
        url: '/ventas/facturacion/alta',
      },
      {
        title: 'common.listado',
        key: 'facturacion',
        url: '/ventas/facturacion',
      },
      {
        title: 'common.clientes',
        key: 'clientes',
        url: '/ventas/clientes',
      },

      {
        title: 'common.ganancias',
        key: 'ganancias',
        url: '/ventas/ganancias',
      },
    ],
  },
  {
    title: 'common.productos',
    key: 'productos',
    icon: <TagsOutlined />,
    url: '/productos',
  },
  {
    title: 'common.usuarios',
    key: 'usuarios',
    icon: <UserOutlined />,
    url: '/usuarios',
  },
];

export const compradorSidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.compras',
    key: 'compras',
    icon: <ShoppingCartOutlined />,
    children: [
      {
        title: 'common.comprar',
        key: 'notapedido/alta',
        url: '/compras/notapedido/alta',
      },
      {
        title: 'common.comparativaProveedores',
        key: 'proveedores/comparativa',
        url: '/compras/proveedores/comparativa',
      },
      {
        title: 'common.listado',
        key: 'notapedido',
        url: '/compras/notapedido',
      },
      {
        title: 'common.proveedores',
        key: 'proveedores',
        url: '/compras/proveedores',
      },
    ],
  },

  {
    title: 'common.productos',
    key: 'productos',
    icon: <TagsOutlined />,
    url: '/productos',
  },
];

export const vendedorSidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.ventas',
    key: 'ventas',
    icon: <ShopOutlined />,
    children: [
      {
        title: 'common.vender',
        key: 'facturacion/alta',
        url: '/ventas/facturacion/alta',
      },
      {
        title: 'common.listado',
        key: 'facturacion',
        url: '/ventas/facturacion',
      },
      {
        title: 'common.clientes',
        key: 'clientes',
        url: '/ventas/clientes',
      },
    ],
  },
];
