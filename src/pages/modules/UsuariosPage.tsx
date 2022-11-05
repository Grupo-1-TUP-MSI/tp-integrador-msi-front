import React, { useEffect } from 'react';
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Space, Spin, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteUsuario, getUsuario, getUsuarios, postUsuario, putUsuario } from '@app/api/usuarios.api';
import { Roles, Usuario } from '@app/models/models';
import { useNavigate, useParams } from 'react-router';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import FormItem from 'antd/es/form/FormItem';
import { FormInput, FormInputPassword, SubmitButton } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { Table } from '@app/components/common/Table/Table';
import { BotonCSV } from '@app/components/shared/BotonCSV';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

export const UsuariosPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchUsuario, setSearchUsuario] = React.useState('');
  const [filterRol, setFilterRol] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [filterEstado, setFilterEstado] = React.useState(true);
  const [usuario, setUsuario] = React.useState<Usuario | null>(null);
  const {
    data: usuariosData,
    isLoading: isLoadingUsuarios,
    refetch: refetchUsuarios,
    isRefetching: isRefetchingUsuarios,
  } = useQuery(['usuarios'], getUsuarios, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: eliminarUsuario, isLoading: isLoadingDelete } = useMutation(deleteUsuario, {
    onSuccess: (res) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.usuarioEliminado'),
          duration: 3,
        });
        setIsModalOpen(false);
        refetchUsuarios();
      } else {
        throw new Error('Error al eliminar usuario');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.usuarioNoEliminado'),
        duration: 3,
      });
    },
  });

  const handleDelete = (record: any) => {
    eliminarUsuario(record.id);
  };

  const columns = [
    {
      title: t('common.nombre'),
      dataIndex: 'nombrecompleto',
      key: 'nombrecompleto',

      sorter: (a: any, b: any) => a.nombrecompleto.localeCompare(b.nombrecompleto),
    },
    {
      title: t('common.email'),
      dataIndex: 'usuario',
      key: 'email',
      width: '25%',

      sorter: (a: any, b: any) => a.usuario.localeCompare(b.usuario),
    },
    {
      title: t('common.rol'),
      dataIndex: 'rol',
      key: 'rol',
      width: '25%',

      sorter: (a: any, b: any) => a.rol.localeCompare(b.rol),
    },
    {
      title: t('common.acciones'),
      width: '10%',
      key: 'acciones',
      render: (text: any, record: any) => (
        <Space>
          <Tooltip placement="top" title={t('common.editar')} trigger="hover" destroyTooltipOnHide>
            <Button
              size="small"
              icon={<EditOutlined />}
              disabled={!record.estado}
              type="text"
              onClick={() => {
                navigate(`/usuarios/${record.id}`);
              }}
            ></Button>
          </Tooltip>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            disabled={!record.estado}
            type="text"
            danger
            onClick={() => {
              setIsModalOpen(true);
              setUsuario(record);
            }}
          ></Button>
        </Space>
      ),
    },
  ];

  const usuariosFiltrados = () => {
    const arr = usuariosData
      ?.filter((usuario: Usuario) => {
        return (
          usuario.usuario.toLowerCase().includes(searchUsuario.toLowerCase()) ||
          usuario.nombrecompleto.toLowerCase().includes(searchUsuario.toLowerCase())
        );
      })
      .filter((usuario: Usuario) => {
        return !!filterEstado ? usuario.estado === filterEstado : true;
      })
      .filter((usuario: Usuario) => {
        return !filterRol || usuario.rol === filterRol;
      })
      .sort((a: Usuario, b: Usuario) => {
        return (a.id as number) - (b.id as number);
      });

    return arr;
  };

  return (
    <>
      <PageTitle>{t('common.usuarios')}</PageTitle>
      <Modal
        title={t('notifications.eliminandoElemento')}
        visible={isModalOpen}
        onOk={() => {
          handleDelete(usuario);
        }}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoadingDelete}
        okText={t('common.confirmar')}
        cancelText={t('common.cancelar')}
      >
        <p>{t('notifications.confirmarEliminacion')}</p>
      </Modal>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h1 style={{ color: 'var(--timeline-background)', fontSize: '25px' }}>{t('common.usuarios')}</h1>

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
              onClick={() => navigate('/usuarios/alta')}
            ></Button>
          </Tooltip>
          <BotonCSV list={usuariosFiltrados()} fileName={'usuarios'} />
        </div>
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
          value={searchUsuario}
          onChange={(e) => setSearchUsuario(e.target.value)}
          placeholder={t('table.buscarUsuario')}
        />
        <Select
          value={filterRol}
          onChange={(value) => setFilterRol(value)}
          style={{ width: 300, marginLeft: 10 }}
          allowClear
          placeholder={t('common.rol')}
        >
          {Roles.map((rol, i) => (
            <Select.Option key={i} value={rol}>
              {rol}
            </Select.Option>
          ))}
        </Select>
        <Checkbox
          checked={filterEstado}
          onChange={(e) => setFilterEstado(e.target.checked)}
          style={{ width: 300, marginLeft: 10, borderRadius: 0 }}
        >
          {t('common.verBorrados')}
        </Checkbox>
      </div>
      <Table
        size="small"
        rowKey={(record) => record.id}
        rowClassName={(record) => (!record.estado ? 'deleted-row' : '')}
        columns={columns}
        pagination={{
          pageSize: 10,
          pageSizeOptions: ['5', '10', '20'],
          showSizeChanger: true,
          locale: {
            items_per_page: t('common.pagina'),
          },
        }}
        dataSource={usuariosFiltrados()}
        loading={isLoadingUsuarios || isRefetchingUsuarios}
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

export const UsuariosForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = React.useState(false);
  const [form] = Form.useForm();

  const { data: usuarioData, isLoading: isLoadingUsuario } = useQuery(
    ['getUsuario'],
    () => getUsuario(parseInt(id as string)),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      enabled: !!id,
    },
  );

  const { mutate: handleCreate, isLoading } = useMutation(postUsuario, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.usuarioCreado'),
          duration: 3,
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
        duration: 3,
      });
    },
  });

  const { mutate: handleEdit, isLoading: isLoadingEdit } = useMutation(putUsuario, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.usuarioActualizado'),
          duration: 3,
        });
        navigate('/usuarios');
      } else {
        throw new Error('Error al editar usuario');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.usuarioNoActualizado'),
        duration: 3,
      });
    },
  });
  useEffect(() => {
    if (id && !isLoadingUsuario) {
      setIsEdit(true);
      form.setFieldsValue({
        id: id,
        usuario: usuarioData?.usuario,
        nombrecompleto: usuarioData?.nombrecompleto,
        rol: usuarioData?.rol,
      });
    }
  }, [usuarioData, isLoadingUsuario, form, id]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      const user = {
        id: parseInt(id as string),
        usuario: values.usuario,
        nombrecompleto: values.nombrecompleto,
        password: values.password,
        idRol: Roles.indexOf(values.rol) + 1,
      };
      handleEdit(user);
    } else {
      const user = {
        usuario: values.usuario,
        nombrecompleto: values.nombrecompleto,
        password: values.password,
        idRol: values.rol,
      };
      handleCreate(user);
    }
  };

  if (isLoadingUsuario && isEdit) {
    return <Spin />;
  }

  return (
    <div>
      <PageTitle>{isEdit ? t('titles.editandoUsuario') : t('titles.creandoUsuario')}</PageTitle>
      <Row>
        <Col offset={8} span={8}>
          <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
            <h1 style={{ fontSize: '25px' }}>{isEdit ? t('titles.editandoUsuario') : t('titles.creandoUsuario')}</h1>
            <FormItem
              requiredMark
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
              <FormInput />
            </FormItem>
            <FormItem
              requiredMark
              name="nombrecompleto"
              label={t('common.nombre')}
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <FormInput />
            </FormItem>
            <FormItem
              requiredMark
              label={t('common.password')}
              name="password"
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <FormInputPassword />
            </FormItem>
            <FormItem
              requiredMark
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
              <FormInputPassword />
            </FormItem>

            <FormItem
              requiredMark
              label={t('common.rol')}
              name="rol"
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <Select allowClear>
                {Roles.map((rol, i) => (
                  <Select.Option key={i} value={i + 1}>
                    {rol}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>

            <BaseForm.Item noStyle>
              <SubmitButton type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                {isEdit ? t('common.editar') : t('common.confirmar')}
              </SubmitButton>
            </BaseForm.Item>
          </BaseForm>
        </Col>
      </Row>
    </div>
  );
};
