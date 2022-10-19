import React from 'react';
import {
  DashboardOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';

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
        title: 'common.proveedores',
        key: 'proveedores',
        url: '/compras/proveedores',
      },
      {
        title: 'common.notapedido',
        key: 'notapedido',
        url: '/compras/notapedido',
      },
    ],
  },
  {
    title: 'common.ventas',
    key: 'ventas',
    icon: <ShopOutlined />,
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
    icon: <TagsOutlined />,
    url: '/productos',
  },
  {
    title: 'common.usuarios',
    key: 'usuarios',
    icon: <UserOutlined />,
    url: '/usuarios',
  },
  {
    title: 'common.ganancias',
    key: 'ganancias',
    icon: <SettingOutlined />,
    url: '/ganancias',
  },
];

export const compradorSidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.compras',
    key: 'compras',
    icon: <ShoppingCartOutlined />,
    children: [
      {
        title: 'common.proveedores',
        key: 'proveedores',
        url: '/compras/proveedores',
      },
      {
        title: 'common.notapedido',
        key: 'notapedido',
        url: '/compras/notapedido',
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
];
