import { ArrowLeftOutlined } from '@ant-design/icons';
import { getFacturaPDF } from '@app/api/facturas.api';
import { Button, Col, Row, Typography } from 'antd';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export const FacturaSuccess = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { Title } = Typography;

  const imprimirPDF = async () => {
    const data = await getFacturaPDF(parseInt(id as string));
    const props: any = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: `ColorCor F00${data.id}-V00${data.numero}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: 'https://i.postimg.cc/3w2KmPdm/logo.png',
        width: 25, //aspect ratio = width/height
        height: 25,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      stamp: {
        inAllPages: true,
        src: 'https://i.postimg.cc/YCCvCcKC/qr-code.jpg',
        width: 20, //aspect ratio = width/height
        height: 20,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      business: {
        name: 'ColorCor S.A.',
        address: 'Zapiola 77',
        phone: '(0351) 155622138',
        email: 'compras@colorcor.com.ar',

        website: 'https://colorcor.netlify.app/',
      },
      contact: {
        label: 'Factura para:',
        name: data.cliente.nombre,
        address: data.cliente.direccion,
        phone: data.cliente.telefono,
        email: data.cliente.email,
      },
      invoice: {
        label: 'Factura #: ',
        num: `${data.id} Numero: ${data.numero}`,
        invDate: `Fecha de elaboracion: ${data.fechaLocale}`,
        //invGenDate: `Fecha de entrega: ${data.vencimientoLocale}`,
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          {
            title: '#',
            style: {
              width: 10,
            },
          },
          {
            title: 'Producto',
            style: {
              width: 30,
            },
          },
          {
            title: 'Descripcion',
            style: {
              width: 70,
            },
          },
          { title: 'Precio Unitario' },
          { title: 'Cantidad' },
          { title: 'Total' },
        ],
        table: Array.from(data.detalles, (item: any, index) => [
          index + 1,
          item.producto,
          item.descripcion,
          item.precio.toLocaleString(),
          item.cantidad,
          (parseFloat(item.precio) * parseFloat(item.cantidad)).toLocaleString(),
        ]),
        additionalRows: [
          {
            col1: 'Gravado:',
            col2: data.acumGravado.toLocaleString(),
            col3: 'ALL',
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: 'IVA:',
            col2: data.acumIVA.toLocaleString(),
            col3: '%',
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: 'Total:',
            col2: data.acumTotal.toLocaleString(),
            col3: 'ALL',
            style: {
              fontSize: 14, //optional, default 12
            },
          },
        ],
      },
      footer: {
        text: 'Esta factura se ha creado via web y es un documento valido.',
      },
      pageEnable: true,
      pageLabel: 'Page ',
    };
    const pdfObj = jsPDFInvoiceTemplate(props);
  };

  return (
    <Row align="middle" justify="start">
      <Button
        style={{
          color: 'var(--primary-color)',
        }}
        className="success-button"
        icon={<ArrowLeftOutlined />}
        type="text"
        onClick={() => {
          navigate('/ventas/facturacion');
        }}
      >
        {t('common.volver')}
      </Button>
      <Col span={24}>
        <div className="success-animation">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <Title style={{ textAlign: 'center' }}>{t('notifications.facturaCreadaConExito')}</Title>
        <Title level={3} type="secondary" style={{ textAlign: 'center' }}>
          {t('notifications.facturaCreadaConExitoCaption', { num: id })}
        </Title>
        <Title level={3} type="secondary" style={{ textAlign: 'center' }}>
          {t('notifications.facturaCreadaConExitoSubCaption')}
          <a onClick={() => imprimirPDF()}>{t('notifications.imprimirla')}</a>.
        </Title>
      </Col>
    </Row>
  );
};
