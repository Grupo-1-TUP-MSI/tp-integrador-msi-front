import { httpApi } from '@app/api/http.api';

export const getFacturas = () => {
  return httpApi.get('facturas').then((res) => res.data);
};

export const getFacturaPDF = (id: number) => {
  return httpApi.get(`facturas/pdf/${id}`).then((res) => res.data.data);
};

export const postFactura = (factura: any) => {
  return httpApi.post('factura', factura).then((res) => res.data.data);
};
