import React, { useEffect } from 'react';
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Space, Spin, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Roles, Cliente, TiposIVA, TiposDocumento } from '@app/models/models';
import { useNavigate, useParams } from 'react-router';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import FormItem from 'antd/es/form/FormItem';
import { FormInput, FormInputPassword, SubmitButton } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { Table } from '@app/components/common/Table/Table';
import { getClientes, getCliente, postCliente, putCliente, deleteCliente } from '../../../api/clientes.api';
import { useResponsive } from '@app/hooks/useResponsive';
import { BotonCSV } from '@app/components/shared/BotonCSV';

export const ClientesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchCliente, setSearchCliente] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [filterEstado, setFilterEstado] = React.useState(true);
  const [cliente, setCliente] = React.useState<Cliente | null>(null);
  const [filterTipoIVA, setFilterTipoIVA] = React.useState(null);
  const {
    data: clientesData,
    isLoading: isLoadingClientes,
    refetch: refetchClientes,
    isRefetching: isRefetchingClientes,
  } = useQuery(['clientes'], getClientes, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: eliminarCliente, isLoading: isLoadingDelete } = useMutation(deleteCliente, {
    onSuccess: (res) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.clienteEliminado'),
          duration: 3,
        });
        setIsModalOpen(false);
        refetchClientes();
      } else {
        throw new Error('Error al eliminar cliente');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.clienteNoEliminado'),
        duration: 3,
      });
    },
  });

  const handleDelete = (record: any) => {
    eliminarCliente(record.id);
  };

  const columns = [
    {
      title: t('common.documento'),
      dataIndex: 'documento',
      key: 'documento',
      render: (text: any, record: any) => TiposDocumento[record.idtipodocumento - 1] + ' ' + record.documento,
    },
    {
      title: t('common.nombre'),
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: t('common.tipoiva'),
      dataIndex: 'tipoiva',
      key: 'tipoiva',
      render: (text: any, record: any) => TiposIVA[record.tipoiva - 1],
    },

    {
      title: t('common.direccion'),
      dataIndex: 'direccion',
      key: 'direccion',
      render: (text: any, record: any) => record.direccion + ', CP: ' + record.cp,
    },
    {
      title: t('common.telefono'),
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: t('common.email'),
      dataIndex: 'email',
      key: 'email',
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
                navigate(`/ventas/clientes/${record.id}`);
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
              setCliente(record);
            }}
          ></Button>
        </Space>
      ),
    },
  ];

  const clientesFiltrados = () => {
    const arr = clientesData
      ?.filter((cliente: Cliente) => {
        return (
          cliente.nombre.toLowerCase().includes(searchCliente.toLowerCase()) ||
          `${TiposDocumento[(cliente.idtipodocumento as number) - 1]} ${cliente.documento}`
            .toLowerCase()
            .includes(searchCliente.toLowerCase())
        );
      })
      .filter((cliente: Cliente) => {
        return !!filterEstado ? cliente.estado === filterEstado : true;
      })
      .filter((cliente: Cliente) => {
        return filterTipoIVA ? TiposIVA[cliente.tipoiva - 1] === filterTipoIVA : true;
      })
      .sort((a: Cliente, b: Cliente) => {
        return (a.id as number) - (b.id as number);
      });

    return arr;
  };

  return (
    <>
      <Modal
        title={t('notifications.eliminandoElemento')}
        visible={isModalOpen}
        onOk={() => {
          handleDelete(cliente);
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
        <h1 style={{ color: 'var(--timeline-background)' }}>{t('common.clientes')}</h1>

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
              onClick={() => navigate('/ventas/clientes/alta')}
            ></Button>
          </Tooltip>
          <BotonCSV list={clientesFiltrados()} fileName={'clientes'} />
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
          value={searchCliente}
          onChange={(e) => setSearchCliente(e.target.value)}
          placeholder={t('table.buscarCliente')}
        />
        <Select
          value={filterTipoIVA}
          onChange={(value) => setFilterTipoIVA(value)}
          style={{ width: 200, marginLeft: '1rem' }}
          placeholder={t('common.tipoiva')}
          allowClear
        >
          {TiposIVA.map((iva, i) => (
            <Select.Option key={i} value={iva}>
              {iva}
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
        dataSource={clientesFiltrados()}
        loading={isLoadingClientes || isRefetchingClientes}
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

export const ClientesForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = React.useState(false);
  const [form] = Form.useForm();
  const documentoLength = Form.useWatch('tipoDocumento', form);
  const { isTablet } = useResponsive();

  const { data: clienteData, isLoading: isLoadingCliente } = useQuery(
    ['getCliente'],
    () => getCliente(parseInt(id as string)),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      enabled: !!id,
    },
  );

  const { mutate: handleCreate, isLoading } = useMutation(postCliente, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.clienteCreado'),
          duration: 3,
        });
        navigate('/ventas/clientes');
      } else {
        throw new Error('Error al crear cliente');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.clienteNoCreado'),
        duration: 3,
      });
    },
  });

  const { mutate: handleEdit, isLoading: isLoadingEdit } = useMutation(putCliente, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.clienteActualizado'),
          duration: 3,
        });
        navigate('/ventas/clientes');
      } else {
        throw new Error('Error al editar cliente');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.clienteNoActualizado'),
        duration: 3,
      });
    },
  });
  useEffect(() => {
    if (id && !isLoadingCliente) {
      setIsEdit(true);
      form.setFieldsValue({
        id: id,
        nombre: clienteData?.nombre,
        tipoiva: clienteData?.tipoiva,
        tipoDocumento: clienteData?.idtipodocumento,
        documento: clienteData?.documento,
        direccion: clienteData?.direccion,
        cp: clienteData?.cp,
        telefono: clienteData?.telefono,
        email: clienteData?.email,
      });
    }
  }, [clienteData, isLoadingCliente, form, id]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      const cliente = {
        id: parseInt(id as string),
        nombre: values.nombre,
        tipoiva: values.tipoiva,
        idtipodocumento: values.tipoDocumento,
        documento: values.documento,
        direccion: values.direccion,
        cp: values.cp,
        telefono: values.telefono,
        email: values.email,
      };
      handleEdit(cliente);
    } else {
      const cliente = {
        nombre: values.nombre,
        tipoiva: values.tipoiva,
        idtipodocumento: values.tipoDocumento,
        documento: values.documento,
        direccion: values.direccion,
        cp: values.cp,
        telefono: values.telefono,
        email: values.email,
      };
      handleCreate(cliente);
    }
  };

  const tipoDocumentoLength = () => {
    return (
      TiposDocumento[parseInt(documentoLength) - 1] === 'CUIT' ||
      TiposDocumento[parseInt(documentoLength) - 1] === 'CUIL'
    );
  };

  if (isLoadingCliente && isEdit) {
    return <Spin />;
  }

  return (
    <div>
      <Row>
        {isTablet ? (
          <Col offset={6} span={12}>
            <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
              <h1>{isEdit ? t('titles.editandoCliente') : t('titles.creandoCliente')}</h1>
              <Row>
                <Col span={6}>
                  <FormItem
                    requiredMark
                    name="tipoDocumento"
                    label={t('common.tipoDocumento')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <Select allowClear disabled={isEdit}>
                      {TiposDocumento.map((td, i) => (
                        <Select.Option key={i} value={i + 1}>
                          {td}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={17} offset={1}>
                  <FormItem
                    requiredMark
                    name="documento"
                    label={t('common.documento')}
                    rules={[
                      { required: true, message: t('common.requiredField') },
                      {
                        pattern: new RegExp('^[0-9]*$'),
                        message: t('common.onlyNumbers'),
                      },
                      {
                        len: tipoDocumentoLength() ? 11 : 8,
                        message: t('common.invalidLength'),
                      },
                    ]}
                  >
                    <FormInput disabled={isEdit} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem
                    requiredMark
                    name="tipoiva"
                    label={t('common.tipoiva')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <Select allowClear>
                      {TiposIVA.map((iva, i) => (
                        <Select.Option key={i} value={i + 1}>
                          {iva}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={17} offset={1}>
                  <FormItem
                    requiredMark
                    name="nombre"
                    label={t('common.cpnombre')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <FormInput />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <FormItem
                    requiredMark
                    name="direccion"
                    label={t('common.direccion')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <FormInput />
                  </FormItem>
                </Col>
                <Col span={7} offset={1}>
                  <FormItem
                    requiredMark
                    name="cp"
                    label={t('common.cp')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <FormInput />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <FormItem requiredMark name="telefono" label={t('common.telefono')}>
                    <FormInput />
                  </FormItem>
                </Col>
                <Col span={12} offset={1}>
                  <FormItem
                    requiredMark
                    name="email"
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
                </Col>
              </Row>
              <BaseForm.Item noStyle>
                <SubmitButton type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                  {isEdit ? t('common.editar') : t('common.confirmar')}
                </SubmitButton>
              </BaseForm.Item>
            </BaseForm>
          </Col>
        ) : (
          <Col span={24}>
            <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
              <h1>{isEdit ? t('titles.editandoCliente') : t('titles.creandoCliente')}</h1>
              <Row>
                <Col span={24}>
                  <FormItem
                    requiredMark
                    name="tipoDocumento"
                    label={t('common.tipoDocumento')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <Select allowClear disabled={isEdit}>
                      {TiposDocumento.map((td, i) => (
                        <Select.Option key={i} value={i + 1}>
                          {td}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem
                    requiredMark
                    name="documento"
                    label={t('common.documento')}
                    rules={[
                      { required: true, message: t('common.requiredField') },
                      {
                        pattern: new RegExp('^[0-9]*$'),
                        message: t('common.onlyNumbers'),
                      },
                      {
                        len: tipoDocumentoLength() ? 11 : 8,
                        message: t('common.invalidLength'),
                      },
                    ]}
                  >
                    <FormInput disabled={isEdit} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem
                    requiredMark
                    name="tipoiva"
                    label={t('common.tipoiva')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <Select allowClear>
                      {TiposIVA.map((iva, i) => (
                        <Select.Option key={i} value={i + 1}>
                          {iva}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem
                    requiredMark
                    name="nombre"
                    label={t('common.cpnombre')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <FormInput />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem
                    requiredMark
                    name="direccion"
                    label={t('common.direccion')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <FormInput />
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem
                    requiredMark
                    name="cp"
                    label={t('common.cp')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <FormInput />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem requiredMark name="telefono" label={t('common.telefono')}>
                    <FormInput />
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem
                    requiredMark
                    name="email"
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
                </Col>
              </Row>
              <BaseForm.Item noStyle>
                <SubmitButton type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                  {isEdit ? t('common.editar') : t('common.confirmar')}
                </SubmitButton>
              </BaseForm.Item>
            </BaseForm>
          </Col>
        )}
      </Row>
    </div>
  );
};
