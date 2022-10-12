import React from 'react';
import { Table } from 'components/common/Table/Table';
import { Button, Col, Input, Row, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsuarios, postUsuario } from '@app/api/usuarios.api';
import { Roles, Usuario } from '@app/models/models';
import { Navigate, useNavigate } from 'react-router';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import FormItem from 'antd/es/form/FormItem';
import { FormInput, FormInputPassword, SubmitButton } from '@app/components/layouts/AuthLayout/AuthLayout.styles';

export const UsuariosPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
        <h1 style={{ color: '#404040' }}>{t('common.usuarios')}</h1>
        <Button
          style={{
            color: 'var(--success-color)',
          }}
          icon={<PlusOutlined />}
          type="text"
          onClick={() => navigate('/usuarios/alta')}
        ></Button>
      </div>
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
          {Roles.map((rol, i) => (
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
            (!filterRol || usuario.rol === filterRol)
          );
        })}
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
        pagination={{
          pageSize: 5,
        }}
      />
    </>
  );
};

export const UsuariosForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate: handleCreate, isLoading } = useMutation(
    ['postUsuario'],
    async (values: any) => {
      postUsuario({
        usuario: values.usuario,
        password: values.password,
        idRol: values.rol,
      });
    },
    {
      onSuccess: (res: any) => {
        if (res?.status !== 400) {
          notificationController.success({
            message: t('common.successMessage'),
            description: t('notifications.usuarioCreado'),
            duration: 3000,
          });
          navigate('/usuarios');
        } else {
          throw new Error('Error al crear usuario');
        }
      },
      onError: (error: Error) => {
        notificationController.error({
          message: t('common.errorMessage'),
          description: t('notifications.usuarioNoCreado'),
          duration: 3000,
        });
      },
    },
  );

  return (
    <div>
      <Row>
        <Col offset={8} span={8}>
          <h1>{t('titles.creandoUsuario')}</h1>
          <BaseForm layout="vertical" onFinish={handleCreate} requiredMark="optional">
            <FormItem
              name="usuario"
              label={t('common.email')}
              rules={[
                { required: true, message: t('common.requiredField') },
                {
                  type: 'email',
                  message: t('common.notValidEmail'),
                },
              ]}
            >
              <FormInput placeholder={t('common.email')} />
            </FormItem>
            <FormItem
              label={t('common.password')}
              name="password"
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <FormInputPassword placeholder={t('common.password')} />
            </FormItem>
            <FormItem
              label={t('common.confirmPassword')}
              name="confirmPassword"
              rules={[
                { required: true, message: t('common.requiredField') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value !== getFieldValue('password')) {
                      return Promise.reject(t('common.passwordsDontMatch'));
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <FormInputPassword placeholder={t('common.password')} />
            </FormItem>

            <FormItem
              label={t('common.rol')}
              name="rol"
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <Select placeholder={t('common.rol')} allowClear>
                {Roles.map((rol, i) => (
                  <Select.Option key={i} value={i + 1}>
                    {rol}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>

            <BaseForm.Item noStyle>
              <SubmitButton type="primary" htmlType="submit" loading={isLoading}>
                {t('login.login')}
              </SubmitButton>
            </BaseForm.Item>
          </BaseForm>
          {/* /* <Select
            placeholder={t('common.rol')}
            value={filterRol}
            onChange={(value) => setFilterRol(value)}
            style={{ width: 300, marginLeft: 10 }}
            allowClear
          >
            {Roles.map((rol, i) => (
              <Select.Option key={i} value={rol}>
                {rol}
              </Select.Option>
            ))}
          </Select>
            <Input placeholder={t('common.email')} /> */}
        </Col>
      </Row>
    </div>
  );
};
