import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { WithChildrenProps } from '@app/types/generalTypes';

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  const expiration = useAppSelector((state) => state.auth.expiration);
  console.log('Expiración de token: ' + expiration);
  return token && new Date(expiration as string).getTime() > new Date().getTime() ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

export default RequireAuth;
