import React from 'react';
import { Navigate } from 'react-router-dom';
import { WithChildrenProps } from '@app/types/generalTypes';
import {
  deleteExpiration,
  deleteRole,
  deleteToken,
  readExpiration,
  readRole,
  readToken,
} from '@app/services/localStorage.service';

const RequireAdminRole: React.FC<WithChildrenProps> = ({ children }) => {
  const token = readToken();
  const role = readRole();
  const compareDates = () => {
    const date = new Date();
    const date2 = new Date(readExpiration() || '');
    console.log(date, date2);
    return date.getTime() < date2.getTime();
  };

  if (!role || role !== 'ADMINISTRADOR') {
    deleteRole();
    deleteToken();
    deleteExpiration();
    return <Navigate to="/auth/login" replace />;
  }

  return token && compareDates() && role === 'ADMINISTRADOR' ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default RequireAdminRole;
