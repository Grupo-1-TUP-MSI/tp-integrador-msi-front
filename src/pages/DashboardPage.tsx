import React, { useEffect, useState } from 'react';
import { Avatar, Card, Col, List, Row, Table } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
// import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './uiComponentsPages/DashboardPage.styles';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { useQuery } from '@tanstack/react-query';
import { getReporteCompraVenta, getReportePendientesDeEntrega } from '@app/api/reportes.api';
import { TipoCompra } from '@app/models/models';
import { useNavigate } from 'react-router-dom';
import { FileOutlined } from '@ant-design/icons';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const navigate = useNavigate();

  const [data, setData] = useState<{ data1: number[]; data2: number[]; xAxisData: string[] }>({
    data1: [],
    data2: [],
    xAxisData: [],
  });

  const { data: pendientesDeEntregaData, isLoading: isLoadingPendientesDeEntrega } = useQuery(
    ['getReportePendientesDeEntrega'],
    getReportePendientesDeEntrega,
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
    },
  );

  const { data: compraVentaData, isLoading: isLoadingCompraVenta } = useQuery(
    ['getReporteCompraVenta'],
    getReporteCompraVenta,
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const { compra, venta, meses } = data;
        setData({ data1: compra, data2: venta, xAxisData: meses });
      },
    },
  );

  const option = {
    legend: {
      data: [t('charts.barras.compras'), t('charts.barras.ventas')],
      left: 20,
      top: 0,
      textStyle: {
        color: themeObject[theme].textMain,
      },
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 0,
      top: 70,
      containLabel: true,
    },
    tooltip: {},
    xAxis: {
      data: data.xAxisData,
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      name: t('charts.promedio'),
      nameTextStyle: {
        padding: [0, -24],
        align: 'left',
      },
    },
    series: [
      {
        name: t('charts.barras.compras'),
        type: 'bar',
        data: data.data1,
        color: themeObject[theme].chartColor4,
        emphasis: {
          focus: 'series',
        },
        animationDelay: (idx: number) => idx * 10,
      },
      {
        name: t('charts.barras.ventas'),
        type: 'bar',
        data: data.data2,
        color: themeObject[theme].chartColor5,
        emphasis: {
          focus: 'series',
        },
        animationDelay: (idx: number) => idx * 10 + 100,
      },
    ],
    animationEasing: 'elasticOut',
  };

  const calcularDemora = (demora: number) => {
    if (demora < 0) {
      return t('common.demorado');
    }
    if (demora < 10) {
      return t('common.prontoVencimiento');
    }
    return t('common.aTiempo');
  };

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <Row>
        <Col xs={24} md={24} lg={8}>
          <Card style={{ margin: 20 }} title={t('titles.ultimosPendientesEntrega')}>
            <List size="small" loading={isLoadingPendientesDeEntrega}>
              {pendientesDeEntregaData?.map((item: any) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={
                      <a
                        onClick={() => {
                          navigate('/compras/notapedido');
                        }}
                      >
                        {t('common.notapedido') + ' - ' + item.proveedor}
                      </a>
                    }
                    description={TipoCompra[item.idtipocompra - 1] + ' - ' + calcularDemora(item.demora)}
                    avatar={<Avatar icon={<FileOutlined />} />}
                  />
                </List.Item>
              ))}
            </List>
          </Card>
        </Col>
        <Col xs={24} md={24} lg={16}>
          <BaseChart style={{ margin: 20 }} option={option} />
        </Col>
      </Row>
      <Row
        style={{
          marginTop: '3rem',
        }}
      >
        <Col span={24}>
          <BaseChart style={{ margin: 20 }} option={option} />
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
