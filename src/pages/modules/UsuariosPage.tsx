import React from 'react';
import { Table } from 'components/common/Table/Table';
import { Button, Input, Select, Space } from 'antd';
import { Pagination } from 'api/table.api';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getUsuarios } from '@app/api/usuarios.api';
import { Roles, Usuario } from '@app/models/models';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const UsuariosPage = () => {
  const { t } = useTranslation();
  const [searchUsuario, setSearchUsuario] = React.useState('');
  const [filterRol, setFilterRol] = React.useState(null);

  const {
    data: usuariosData,
    isLoading: isLoadingUsuarios,
    isRefetching: isRefetchingUsuarios,
  } = useQuery(
    ['usuarios'],
    async () => {
      return await getUsuarios();
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  const columns = [
    {
      title: t('common.id'),
      dataIndex: 'id',
      key: 'id',
      width: '5%',
    },
    {
      title: t('common.email'),
      dataIndex: 'usuario',
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
      render: (text: string, usuario: Usuario) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => {
                console.log('Editar', usuario);
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <Input
          placeholder={t('table.buscarUsuario')}
          value={searchUsuario}
          onChange={(e) => setSearchUsuario(e.target.value)}
        />
        <Select
          placeholder={t('common.rol')}
          value={filterRol}
          onChange={(value) => setFilterRol(value)}
          style={{ width: 300, marginLeft: 10 }}
          allowClear
        >
          {Object.values(Roles).map((rol, i) => (
            <Select.Option key={i} value={rol}>
              {rol}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={usuariosData?.filter((usuario: Usuario) => {
          return (
            usuario.usuario.toLowerCase().includes(searchUsuario.toLowerCase()) &&
            (filterRol === null || usuario.rol === filterRol)
          );
        })}
        pagination={initialPagination}
        loading={isLoadingUsuarios || isRefetchingUsuarios}
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
