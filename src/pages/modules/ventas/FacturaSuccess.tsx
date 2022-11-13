import { ArrowLeftOutlined } from '@ant-design/icons';
import { getFacturaPDF } from '@app/api/facturas.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { zeroPad } from '@app/utils/utils';
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
        src: 'https://i.ibb.co/6r9YkfP/logo.png',
        width: 25, //aspect ratio = width/height
        height: 25,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      stamp: {
        inAllPages: true,
        src: '',
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
        label: t('common.facturaPara'),
        name: data.cliente.nombre,
        address: data.cliente.direccion,
        phone: data.cliente.telefono,
        email: data.cliente.email,
      },
      invoice: {
        label: `${t('common.facturaN')}0008-`,
        num: `${zeroPad(data.numero, 8)}`,
        invDate: `${t('common.fechaElaboracion')} ${data.fechaLocale}`,
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
            title: t('common.producto'),
            style: {
              width: 50,
            },
          },
          {
            title: t('common.descripcion'),
            style: {
              width: 50,
            },
          },
          { title: t('common.importeunitario') },
          { title: t('common.cantidad') },
          { title: t('common.importetotal') },
        ],
        table: Array.from(data.detalles, (item: any, index) => [
          index + 1,
          item.producto,
          item.descripcion,
          `$ ${item.precio.toFixed(2).toLocaleString()}`,
          item.cantidad,
          `$ ${(parseFloat(item.precio) * parseFloat(item.cantidad)).toFixed(2).toLocaleString()}`,
        ]),
        additionalRows: [
          {
            col1: t('common.subtotal'),
            col2: `$ ${data.acumGravado.toFixed(2).toLocaleString()}`,
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: t('common.iva'),
            col2: `$ ${data.acumIVA.toFixed(2).toLocaleString()}`,
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: t('common.importetotal'),
            col2: `$ ${data.acumTotal.toFixed(2).toLocaleString()}`,
            style: {
              fontSize: 14, //optional, default 12
            },
          },
        ],
      },
      footer: {
        text: t('common.notaPedidoFooter'),
      },
      pageEnable: true,
      pageLabel: 'Page ',
    };
    const pdfObj = jsPDFInvoiceTemplate(props);
  };

  return (
    <Row align="middle" justify="start">
      <PageTitle>{t('notifications.facturaCreadaConExito')}</PageTitle>
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
