import { httpApi } from '@app/api/http.api';

export const getReporteCompraVenta = () => {
  return httpApi.get('reportes/compraventa').then((res) => res.data.data);
};

export const getReportePendientesDeEntrega = () => {
  return httpApi.get('reportes/np/pde').then((res) => res.data.data);
};
