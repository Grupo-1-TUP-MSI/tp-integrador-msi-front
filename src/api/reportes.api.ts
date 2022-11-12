import { httpApi } from '@app/api/http.api';

export const getReporteCompraVenta = ({ desde, hasta }: any) => {
  return httpApi.get(`reportes/compraventa?desde=${desde}&hasta=${hasta}`).then((res) => {
    return { compras: res.data.compras, ventas: res.data.ventas, dias: res.data.dias };
  });
};

export const getReportePendientesDeEntrega = () => {
  return httpApi.get('reportes/np/pde').then((res) => res.data.data);
};

export const getPieCharts = ({ desde, hasta }: any) => {
  return httpApi.get(`reportes/pie-charts?desde=${desde}&hasta=${hasta}`).then((res) => res.data);
};
