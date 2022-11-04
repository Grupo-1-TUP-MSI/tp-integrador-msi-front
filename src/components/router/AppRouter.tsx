import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import DashboardPage from '@app/pages/DashboardPage';
import { NotasDePedidoForm } from '@app/pages/modules/compras/NotasDePedidoPage';
import { NotasDePedidoPage } from '@app/pages/modules/compras/NotasDePedidoPage';
import { ProveedoresForm } from '@app/pages/modules/compras/ProveedoresPage';
import { ProveedoresPage } from '@app/pages/modules/compras/ProveedoresPage';
import { ProveedoresComparativaPage } from '@app/pages/modules/compras/ProveedoresComparativaPage';
import { ProductosForm } from '@app/pages/modules/ProductosPage';
import { ProductosPage } from '@app/pages/modules/ProductosPage';
import { ClientesForm } from '@app/pages/modules/ventas/ClientesPage';
import { ClientesPage } from '@app/pages/modules/ventas/ClientesPage';
import { FacturacionForm } from '@app/pages/modules/ventas/FacturacionPage';
import { FacturacionPage } from '@app/pages/modules/ventas/FacturacionPage';
import { UsuariosForm } from '@app/pages/modules/UsuariosPage';
import { UsuariosPage } from '@app/pages/modules/UsuariosPage';
import { GananciasPage } from '@app/pages/modules/ventas/GananciasPage';
import { FacturaSuccess } from '@app/pages/modules/ventas/FacturaSuccess';
import RequireVentasRole from './RequireVentasRole';
import RequireComprasRole from './RequireComprasRole';

const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const Logout = React.lazy(() => import('./Logout'));
const NotasDePedidoF = withLoading(NotasDePedidoForm);
const NotasDePedidoP = withLoading(NotasDePedidoPage);
const ProveedoresF = withLoading(ProveedoresForm);
const ProveedoresP = withLoading(ProveedoresPage);
const ProveedoresC = withLoading(ProveedoresComparativaPage);
const ProductosF = withLoading(ProductosForm);
const ProductosP = withLoading(ProductosPage);
const ClientesF = withLoading(ClientesForm);
const ClientesP = withLoading(ClientesPage);
const FacturacionF = withLoading(FacturacionForm);
const FacturacionP = withLoading(FacturacionPage);
const FacturasSuccess = withLoading(FacturaSuccess);
const UsuariosF = withLoading(UsuariosForm);
const UsuariosP = withLoading(UsuariosPage);
const Ganancias = withLoading(GananciasPage);
const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  const protectedVentasLayout = (
    <RequireVentasRole>
      <MainLayout />
    </RequireVentasRole>
  );

  const protectedComprasLayout = (
    <RequireComprasRole>
      <MainLayout />
    </RequireComprasRole>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
        <Route path="/" element={protectedLayout}>
          <Route index element={<DashboardPage />} />

          <Route path="productos" element={<ProductosP />} />
          <Route path="productos/alta" element={<ProductosF />} />
          <Route path="productos/:id" element={<ProductosF />} />
          <Route path="usuarios" element={<UsuariosP />} />
          <Route path="usuarios/alta" element={<UsuariosF />} />
          <Route path="usuarios/:id" element={<UsuariosF />} />
          <Route path="500" element={<ServerError />} />
        </Route>
        <Route path="/ventas" element={protectedVentasLayout}>
          <Route path="clientes" element={<ClientesP />} />
          <Route path="clientes/alta" element={<ClientesF />} />
          <Route path="clientes/:id" element={<ClientesF />} />
          <Route path="facturacion" element={<FacturacionP />} />
          <Route path="facturacion/alta" element={<FacturacionF />} />
          <Route path="facturacion/:id" element={<FacturacionF />} />
          <Route path="facturacion/pago-exitoso/:id" element={<FacturasSuccess />} />
          <Route path="ganancias" element={<Ganancias />} />
        </Route>
        <Route path="/compras" element={protectedComprasLayout}>
          <Route path="proveedores" element={<ProveedoresP />} />
          <Route path="proveedores/alta" element={<ProveedoresF />} />
          <Route path="proveedores/:id" element={<ProveedoresF />} />
          <Route path="proveedores/comparativa" element={<ProveedoresC />} />
          <Route path="notapedido" element={<NotasDePedidoP />} />
          <Route path="notapedido/alta" element={<NotasDePedidoF />} />
          <Route path="notapedido/:id" element={<NotasDePedidoF />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};
