import React, { useState, useEffect, useCallback } from 'react';
import { Table } from 'components/common/Table/Table';
import { Button, Space, TablePaginationConfig } from 'antd';
import { getTableData, Pagination } from 'api/table.api';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const UsuariosPage = () => {
  const [tableData, setTableData] = useState<{ data: any[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const fetch = useCallback(
    (pagination: Pagination) => {
      const res = getTableData(pagination);
      if (isMounted.current) {
        setTableData({ data: res.data, pagination: res.pagination, loading: false });
      }
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetch(pagination);
  };

  const columns = [
    {
      title: t('common.id'),
      dataIndex: 'id',
      key: 'id',
      width: '5%',
    },
    {
      title: t('common.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('common.rol'),
      dataIndex: 'rol',
      key: 'rol',
      width: '25%',
    },
    {
      title: t('common.acciones'),
      dataIndex: 'acciones',
      width: '10%',
      key: 'acciones',
      render: (text: string, item: any) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => {
                console.log('Editar', item);
              }}
            ></Button>
            <Button icon={<DeleteOutlined />} type="text" danger onClick={() => console.log('borrar')}></Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {t('common.usuarios')}
      <Table
        columns={columns}
        dataSource={tableData.data}
        pagination={tableData.pagination}
        loading={tableData.loading}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
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

export const UsuariosForm = () => {
  return <div>UsuariosPage</div>;
};
