import { httpApi } from '@app/api/http.api';

export const getReporteCompraVenta = () => {
  return httpApi.get('reportes/compraventa').then((res) => {
    return { compras: res.data.compras, ventas: res.data.ventas, meses: res.data.meses };
  });
};

export const getReportePendientesDeEntrega = () => {
  return httpApi.get('reportes/np/pde').then((res) => res.data.data);
};
