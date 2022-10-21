import React from 'react';
import { Col, Row } from 'antd';

const Factura = ({ factura }: any) => {
  const subtotal = () => {
    let sub = 0;
    factura?.detalle.forEach((item: any) => {
      sub += item.cantidad * item.precio;
    });
    return sub;
  };
  const iva = () => {
    return subtotal() * 0.21;
  };
  const total = () => {
    return subtotal() + iva();
  };
  return (
    <div id="factura-de-pedido">
      {/* Cabecera */}
      <Row>
        <Col span={12}>
          <Row>
            <Col span={6}>
              <img src="@app/assets/logo.png" width="100%" height="100%" />
            </Col>
            <Col span={18}>
              <div>Pinturería Colorcor</div>
              <div>Av. Color 123</div>
              <div>Córdoba</div>
              <div>IVA Responsable Inscripto</div>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row justify="end">
            <Col span={12} style={{ textAlign: 'right' }}>
              <b>Factura</b>
            </Col>
            <Col span={12}>{factura?.id}</Col>
          </Row>
          <Row justify="end">
            <Col style={{ textAlign: 'right' }}>
              <b>Fecha:</b> {factura?.fecha}
            </Col>
          </Row>
          <Row justify="end">
            <Col>
              <Row justify="end">
                <b>CUIT No: </b> 30-12345678-3
              </Row>
              <Row justify="end">
                <b>Ingresos Brutos No: </b> 12-3456-0
              </Row>
              <Row justify="end">
                <b>Inicio Actividad: </b> 01/01/2000
              </Row>
            </Col>
          </Row>
        </Col>
        <div className="tipoComprobante">X</div>
      </Row>
      <hr />
      {/* Subcabecera */}
      <Row>
        <Col span={24}>
          <Row>
            <b>Señor:</b> {factura?.cliente.nombre}
          </Row>
          <Row>
            <b>Domicilio:</b> {factura?.cliente.domicilio} - <b>CP:</b> {factura?.cliente.cp}
          </Row>
          <Row>
            <b>IVA:</b> {factura?.cliente.tipoiva} - {factura?.cliente.tipodocumento}: {factura?.cliente.documento}
          </Row>
        </Col>
      </Row>
      {/* Detalles */}
      <Row>
        <Col span={24}>
          <table className="tabla-detalle">
            <thead>
              <tr>
                <th className="detalle">Cantidad</th>
                <th className="detalle">Descripción</th>
                <th className="detalle">Importe unitario</th>
                <th className="detalle">IVA Unitario</th>
                <th className="detalle">Importe total</th>
              </tr>
            </thead>
            <tbody>
              {factura?.detalle.map((item: any) => (
                <tr key={item.id}>
                  <td className="detalle">{item.cantidad}</td>
                  <td className="detalle">{item.id + ' - ' + item.descripcion}</td>
                  <td className="detalle">{item.importeUnitario}</td>
                  <td className="detalle">{item.ivaUnitario}</td>
                  <td className="detalle">{item.importeTotal}</td>
                </tr>
              ))}
              <tr>
                <td className="detalle" colSpan={4} align="right">
                  <b>Gravado total</b>
                </td>
                <td className="detalle" align="center">
                  ${subtotal()}
                </td>
              </tr>
              <tr>
                <td className="detalle" colSpan={4} align="right">
                  <b>IVA</b>
                </td>
                <td className="detalle" align="center">
                  ${iva()}
                </td>
              </tr>
              <tr>
                <td className="detalle" colSpan={4} align="right">
                  <b>Total</b>
                </td>
                <td className="detalle" align="center">
                  ${total()}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <b>Vencimiento:</b> {factura?.vencimiento}
        </Col>
        <Col span={24}>
          <b>Condiciones de venta:</b> Contado - <b>Tipo de compra:</b> {factura?.tipoCompra}
        </Col>
      </Row>
    </div>
  );
};

export default Factura;
