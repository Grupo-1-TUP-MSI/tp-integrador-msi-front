import React from 'react';
import { Navigate } from 'react-router-dom';
import { WithChildrenProps } from '@app/types/generalTypes';
import { readExpiration, readRole, readToken } from '@app/services/localStorage.service';

const RequireComprasRole: React.FC<WithChildrenProps> = ({ children }) => {
  const token = readToken();
  const role = readRole();
  const compareDates = () => {
    const date = new Date();
    const date2 = new Date(readExpiration() || '');
    console.log(date, date2);
    return date.getTime() < date2.getTime();
  };
  return token && compareDates() && (role === 'COMPRADOR' || role === 'ADMINISTRADOR') ? <>{children}</> : null;
};

export default RequireComprasRole;
