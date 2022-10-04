import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';

const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const AdvancedFormsPage = React.lazy(() => import('@app/pages/AdvancedFormsPage'));
const Logout = React.lazy(() => import('./Logout'));

const AdvancedForm = withLoading(AdvancedFormsPage);

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
        <Route path="/" element={protectedLayout}>
          <Route path="ventas">
            <Route path="clientes" element={<AdvancedForm />} />
            <Route path="clientes/:id" element={<AdvancedForm />} />
            <Route path="facturacion" element={<AdvancedForm />} />
            <Route path="facturacion/:id" element={<AdvancedForm />} />
          </Route>
          <Route path="compras">
            <Route path="proveedores" element={<AdvancedForm />} />
            <Route path="proveedores/:id" element={<AdvancedForm />} />
            <Route path="notas-de-pedido" element={<AdvancedForm />} />
            <Route path="notas-de-pedido/:id" element={<AdvancedForm />} />
          </Route>
          <Route path="productos" element={<AdvancedForm />} />
          <Route path="productos/:id" element={<AdvancedForm />} />
          <Route path="usuarios" element={<AdvancedForm />} />
          <Route path="usuarios/:id" element={<AdvancedForm />} />
          <Route path="500" element={<ServerError />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};
