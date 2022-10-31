import React from 'react';
import { Navigate } from 'react-router-dom';
import { WithChildrenProps } from '@app/types/generalTypes';
import { readExpiration } from '@app/services/localStorage.service';

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  const compareDates = () => {
    const date = new Date();
    const date2 = new Date(readExpiration() || '');
    console.log(date, date2);
    return date.getTime() < date2.getTime();
  };
  return token && compareDates() ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
