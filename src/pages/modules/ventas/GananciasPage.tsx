import React, { useEffect } from 'react';
import { Button, DatePicker, InputNumber, Modal, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { notificationController } from '@app/controllers/notificationController';
import { Table } from '@app/components/common/Table/Table';
import { getGanancias, postGanancia } from '@app/api/ganancias.api';
import localeES from 'antd/es/date-picker/locale/es_ES';
import localeEN from 'antd/es/date-picker/locale/en_US';
import localePT from 'antd/es/date-picker/locale/pt_BR';
import { BotonCSV } from '@app/components/shared/BotonCSV';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useLanguage } from '@app/hooks/useLanguage';

export const GananciasPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [locale, setLocale] = React.useState(() =>
    language === 'es' ? localeES : language === 'en' ? localeEN : localePT,
  );

  useEffect(() => {
    setLocale(language === 'es' ? localeES : language === 'en' ? localeEN : localePT);
  }, [language]);
  const [modal, setModal] = React.useState(false);
  const [porcentaje, setPorcentaje] = React.useState(0);
  const [vigencia, setVigencia] = React.useState<any>(null);
  const {
    data: gananciasData,
    isLoading: isLoadingGanancias,
    refetch: refetchGanancias,
    isRefetching: isRefetchingGanancias,
  } = useQuery(['ganancias'], getGanancias, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });
  const { mutate: crearGanancia, isLoading: isLoadingCambiarEstado } = useMutation(postGanancia, {
    onSuccess: (res) => {
      notificationController.success({
        message: t('common.successMessage'),
        description: t('notifications.gananciaCambio'),
        duration: 3,
      });
      setModal(false);
      setPorcentaje(0);
      setVigencia(null);
      refetchGanancias();
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.gananciaNoCambio'),
        duration: 3,
      });
    },
  });

  const columns = [
    {
      title: t('common.vigencia'),
      dataIndex: 'vigencia',
      key: 'vigencia',

      sorter: (a: any, b: any) => new Date(a.vigencia).getTime() - new Date(b.vigencia).getTime(),
      render: (text: any, record: any) => {
        return <span>{new Date(record.vigencia).toLocaleDateString('es')}</span>;
      },
    },
    {
      title: t('common.porcentaje'),
      dataIndex: 'porcentaje',
      key: 'porcentaje',
      width: '25%',

      sorter: (a: any, b: any) => a.porcentaje - b.porcentaje,
      render: (text: any, record: any) => {
        return (
          <span>
            {record.porcentaje} {t('common.porcentajeSobre')}
          </span>
        );
      },
    },
    {
      title: t('common.usuario'),
      dataIndex: 'usuario',
      key: 'usuario',
      width: '25%',

      sorter: (a: any, b: any) => a.usuario - b.usuario,
    },
  ];

  const mayorVigencia = () => {
    return new Date(new Date(gananciasData[0]?.vigencia).getTime() + 86400000);
  };

  return (
    <>
      <PageTitle>{t('common.margenGanancias')}</PageTitle>
      <Modal
        title={t('notifications.cambiandoMargenGanancias')}
        visible={modal}
        onOk={() => {
          crearGanancia({
            vigencia,
            porcentaje,
          });
        }}
        onCancel={() => setModal(false)}
        okButtonProps={{ disabled: vigencia == null || porcentaje == null }}
        confirmLoading={isLoadingCambiarEstado}
        okText={t('common.confirmar')}
        cancelText={t('common.cancelar')}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            marginBottom: '10px',
          }}
        >
          <div style={{ marginLeft: '3rem', marginRight: '1.2rem', width: '30%' }}>{t('common.nuevoPorcentaje')}:</div>
          <InputNumber
            style={{
              width: '60%',
            }}
            min={0}
            value={porcentaje}
            onChange={(value) => {
              setPorcentaje(value);
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            marginBottom: '10px',
          }}
        >
          <div style={{ marginLeft: '3rem', marginRight: '1.2rem', width: '30%' }}>{t('common.desdeGanancia')}:</div>
          <DatePicker
            style={{
              width: '60%',
            }}
            format="DD/MM/YYYY"
            showToday
            disabledDate={(current) =>
              current && (new Date(current.format()) <= mayorVigencia() || new Date(current.format()) < new Date())
            }
            locale={locale}
            value={vigencia}
            onChange={(value) => {
              setVigencia(value);
            }}
          />
        </div>
      </Modal>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h1 style={{ color: 'var(--timeline-background)', fontSize: '25px' }}>{t('common.margenGanancias')}</h1>

        <div>
          <Tooltip placement="left" title={t('common.crear')} trigger="hover" destroyTooltipOnHide>
            <Button
              style={{
                color: 'var(--success-color)',
                borderRadius: '2rem',
              }}
              className="success-button"
              icon={<PlusOutlined />}
              type="text"
              onClick={() => setModal(true)}
            ></Button>
          </Tooltip>
          <BotonCSV list={gananciasData} fileName={'ganancias'} />
        </div>
      </div>
      <Table
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={gananciasData}
        loading={isLoadingGanancias || isRefetchingGanancias}
        pagination={{
          pageSize: 10,
          pageSizeOptions: ['5', '10', '20'],
          showSizeChanger: true,
          locale: {
            items_per_page: t('common.pagina'),
          },
        }}
        scroll={{ x: 800 }}
        showSorterTooltip={false}
        locale={{
          filterTitle: t('table.filterTitle'),
          filterConfirm: t('table.filterConfirm'),
          filterReset: t('table.filterReset'),
          filterEmptyText: t('table.filterEmptyText'),
          filterCheckall: t('table.filterCheckall'),
          filterSearchPlaceholder: t('table.filterSearchPlaceholder'),
          emptyText: t('table.emptyText'),
          selectAll: t('table.selectAll'),
          selectInvert: t('table.selectInvert'),
          selectNone: t('table.selectNone'),
          selectionAll: t('table.selectionAll'),
          sortTitle: t('table.sortTitle'),
          expand: t('table.expand'),
          collapse: t('table.collapse'),
          triggerDesc: t('table.triggerDesc'),
          triggerAsc: t('table.triggerAsc'),
          cancelSort: t('table.cancelSort'),
        }}
      />
    </>
  );
};
