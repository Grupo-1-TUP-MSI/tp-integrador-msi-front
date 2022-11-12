import React, { Suspense, useCallback, useState } from 'react';
import { Avatar, Card, Col, DatePicker, List, Row } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
// import { useResponsive } from '@app/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { useQuery } from '@tanstack/react-query';
import { getReporteCompraVenta, getReportePendientesDeEntrega, getPieCharts } from '@app/api/reportes.api';
import { TipoCompra, TipoVenta } from '@app/models/models';
import { useNavigate } from 'react-router-dom';
import { FileOutlined } from '@ant-design/icons';
import { PieChart } from '@app/components/common/charts/PieChart';
import { Legend } from '@app/components/common/charts/Legend/Legend';
import moment from 'moment';
import localeES from 'antd/es/date-picker/locale/es_ES';
import localeEN from 'antd/es/date-picker/locale/en_US';
import localePT from 'antd/es/date-picker/locale/pt_BR';
import { Loading } from '@app/components/common/Loading';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [locale, setLocale] = React.useState(() =>
    i18n.language === 'es' ? localeES : i18n.language === 'en' ? localeEN : localePT,
  );
  const { RangePicker } = DatePicker;
  const [desde, setDesde] = useState<any>(moment().subtract(15, 'days'));
  const [hasta, setHasta] = useState<any>(moment());
  const [desdeTortas, setDesdeTortas] = useState<any>(moment().subtract(15, 'days'));
  const [hastaTortas, setHastaTortas] = useState<any>(moment());

  const [data, setData] = useState<{ data1: string[]; data2: string[]; xAxisData: string[] }>({
    data1: [],
    data2: [],
    xAxisData: [],
  });

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const { data: pendientesDeEntregaData, isLoading: isLoadingPendientesDeEntrega } = useQuery(
    ['getReportePendientesDeEntrega'],
    getReportePendientesDeEntrega,
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
    },
  );

  const {
    data: compraVentaData,
    isLoading: isLoadingCompraVenta,
    refetch,
  } = useQuery(
    ['getReporteCompraVenta', desde, hasta],
    () => getReporteCompraVenta({ desde: desde.format('YYYY-MM-DD'), hasta: hasta.format('YYYY-MM-DD') }),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,

      onSuccess: (data) => {
        const { compras, ventas, dias } = data;
        const ventasFixed: string[] = [];
        const comprasFixed: string[] = [];

        ventas.forEach((element: number) => {
          if (!element) {
            element = 0;
          }
          ventasFixed.push(element.toFixed(2));
        });

        compras.forEach((elementCompras: number) => {
          if (!elementCompras) {
            elementCompras = 0;
          }
          comprasFixed.push(elementCompras.toFixed(2));
        });

        // Crear un arreglo de meses entre las fechas seleccionadas

        setData({ data1: comprasFixed, data2: ventasFixed, xAxisData: dias });
      },
    },
  );

  const {
    data: pieChartsData,
    isLoading: isLoadingPieCharts,
    refetch: refetchTortas,
  } = useQuery(
    ['getPieCharts', desdeTortas, hastaTortas],
    () => getPieCharts({ desde: desdeTortas.format('YYYY-MM-DD'), hasta: hastaTortas.format('YYYY-MM-DD') }),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setIsFirstLoad(false);
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
        animationDelay: (idx: number) => idx * 70,
      },
      {
        name: t('charts.barras.ventas'),
        type: 'bar',
        data: data.data2,
        color: themeObject[theme].chartColor5,
        emphasis: {
          focus: 'series',
        },
        animationDelay: (idx: number) => idx * 70 + 100,
      },
    ],
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

  const generateLegendData = (data: any, compras: boolean) => {
    return data?.map((item: any) => ({
      ...item,
      value: `${compras ? TipoCompra[item.idTipo - 1] : TipoVenta[item.idTipo - 1]}`,
      description: `${item.value}`,
    }));
  };

  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const onMouseOver = useCallback(
    ({ dataIndex }: { dataIndex: number | null }) => setActiveItemIndex(dataIndex),
    [setActiveItemIndex],
  );
  const onMouseOut = useCallback(() => setActiveItemIndex(null), [setActiveItemIndex]);

  const onEvents = {
    mouseover: onMouseOver,
    mouseout: onMouseOut,
  };

  if (isFirstLoad && (isLoadingPendientesDeEntrega || isLoadingCompraVenta || isLoadingPieCharts)) {
    return (
      <Row style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading />;
        </Col>
      </Row>
    );
  }

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
              {pendientesDeEntregaData?.length === 0 && (
                <List.Item>
                  <List.Item.Meta description={t('notifications.noHayDatos')} />
                </List.Item>
              )}
            </List>
          </Card>
        </Col>
        <Col xs={24} md={24} lg={16}>
          <Card
            style={{ margin: 20 }}
            title={t('titles.comprasVentas')}
            actions={[
              <RangePicker
                locale={locale}
                key="rangePicker"
                disabled={isLoadingCompraVenta}
                defaultValue={[desde, hasta]}
                onChange={(dates: any, dateStrings) => {
                  setDesde(dates[0]);
                  setHasta(dates[1]);
                  refetch();
                }}
              />,
            ]}
          >
            <BaseChart option={option} />
          </Card>
        </Col>
      </Row>
      <Row
        style={{
          marginTop: '3rem',
        }}
      >
        <Col
          xs={24}
          md={24}
          lg={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <h1 style={{ color: 'var(--timeline-background)', fontSize: '25px' }}>
            {t('titles.tiposCompraMontoCantidad')}
          </h1>

          <RangePicker
            style={{
              width: '400px',
            }}
            locale={locale}
            key="rangePicker"
            disabled={isLoadingPieCharts}
            defaultValue={[desdeTortas, hastaTortas]}
            onChange={(dates: any, dateStrings) => {
              setDesdeTortas(dates[0]);
              setHastaTortas(dates[1]);
              refetchTortas();
            }}
          />
        </Col>
        <Col xs={24} md={12} lg={12}>
          <Card style={{ margin: 20 }} title={t('titles.tiposCompraMonto')}>
            <PieChart
              data={pieChartsData?.comprasMonto.map((d: any) => ({
                ...d,
                value: d.value.toFixed(2),
                name: TipoCompra[d.idTipo - 1],
              }))}
            />
            <Legend
              legendItems={
                generateLegendData(
                  pieChartsData?.comprasMonto.map((m: any) => ({
                    ...m,
                    value: `$${m.value.toFixed(2)}`,
                  })),
                  true,
                ) || []
              }
              activeItemIndex={activeItemIndex}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <Card style={{ margin: 20 }} title={t('titles.tiposCompraCantidad')}>
            <PieChart
              data={pieChartsData?.comprasCantidad.map((d: any) => ({ ...d, name: TipoCompra[d.idTipo - 1] }))}
            />
            <Legend
              legendItems={generateLegendData(pieChartsData?.comprasCantidad, true) || []}
              activeItemIndex={activeItemIndex}
            />
          </Card>
        </Col>
        <Col
          xs={24}
          md={24}
          lg={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <h1 style={{ color: 'var(--timeline-background)', fontSize: '25px' }}>
            {t('titles.tiposVentaMontoCantidad')}
          </h1>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <Card style={{ margin: 20 }} title={t('titles.tiposVentaMonto')}>
            <PieChart
              data={pieChartsData?.ventasMonto.map((d: any) => ({
                ...d,
                value: d.value.toFixed(2),
                name: TipoVenta[d.idTipo - 1],
              }))}
            />
            <Legend
              legendItems={
                generateLegendData(
                  pieChartsData?.ventasMonto.map((m: any) => ({
                    ...m,
                    value: `$${m.value.toFixed(2)}`,
                  })),
                  false,
                ) || []
              }
              activeItemIndex={activeItemIndex}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <Card style={{ margin: 20 }} title={t('titles.tiposVentaCantidad')}>
            <PieChart data={pieChartsData?.ventasCantidad.map((d: any) => ({ ...d, name: TipoVenta[d.idTipo - 1] }))} />
            <Legend
              legendItems={generateLegendData(pieChartsData?.ventasCantidad, false) || []}
              activeItemIndex={activeItemIndex}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
