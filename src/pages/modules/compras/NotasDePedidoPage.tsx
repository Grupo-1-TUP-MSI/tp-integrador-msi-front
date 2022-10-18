import React, { useEffect } from 'react';
import { Button, Col, DatePicker, Form, Modal, Row, Select, Space, Spin, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  DeleteOutlined,
  DeliveredProcedureOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SubnodeOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Proveedor, TiposIVA, TiposDocumento, NotaPedido, EstadoNP, TipoCompra, Usuario } from '@app/models/models';
import { useNavigate, useParams } from 'react-router';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import FormItem from 'antd/es/form/FormItem';
import { FormInput, SubmitButton } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { Table } from '@app/components/common/Table/Table';
import { getProveedores, getProveedor, postProveedor, putProveedor } from '../../../api/proveedores.api';
import { useResponsive } from '@app/hooks/useResponsive';
import {
  getNotasPedidos,
  getNotaPedido,
  postNotaPedido,
  putNotaPedido,
  deleteNotaPedido,
  putEstado,
} from '@app/api/notasPedido.api';
import { getUsuarios } from '@app/api/usuarios.api';
import locale from 'antd/es/date-picker/locale/es_ES';

export const NotasDePedidoPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [notaPedido, setNotaPedido] = React.useState<any>(null);
  const [filterUsuario, setFilterUsuario] = React.useState(null);
  const [filterProveedor, setFilterProveedor] = React.useState(null);
  const [filterEstadoNP, setFilterEstadoNP] = React.useState<number | null>(null);
  const [filterDates, setFilterDates] = React.useState<any>([]);
  const [filterExpiration, setFilterExpiration] = React.useState<any>([]);
  const [modalEstado, setModalEstado] = React.useState(false);
  const [estado, setEstado] = React.useState<any>(null);
  const {
    data: notasDePedidoData,
    isLoading: isLoadingNotasDePedido,
    refetch: refetchNotasDePedido,
    isRefetching: isRefetchingNotasDePedido,
  } = useQuery(['np'], getNotasPedidos, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });
  const { data: usuariosData, isLoading: isLoadingUsuarios } = useQuery(['usuarios'], getUsuarios, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });
  const { data: proveedoresData, isLoading: isLoadingProveedores } = useQuery(['proveedores'], getProveedores, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: eliminarNotaDePedido, isLoading: isLoadingDelete } = useMutation(deleteNotaPedido, {
    onSuccess: (res) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.npEliminado'),
          duration: 3,
        });
        setIsModalOpen(false);
        refetchNotasDePedido();
      } else {
        throw new Error('Error al eliminar np');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.npNoEliminado'),
        duration: 3,
      });
    },
  });
  const { mutate: cambiarEstado, isLoading: isLoadingCambiarEstado } = useMutation(
    () => putEstado(notaPedido?.id, estado),
    {
      onSuccess: (res) => {
        if (res !== 400) {
          notificationController.success({
            message: t('common.successMessage'),
            description: t('notifications.cambioEstadoNP'),
            duration: 3,
          });
          setIsModalOpen(false);
          refetchNotasDePedido();
        } else {
          throw new Error('Error al cambiar estado');
        }
      },
      onError: (error: Error) => {
        notificationController.error({
          message: t('common.errorMessage'),
          description: t('notifications.noCambioEstadoNP'),
          duration: 3,
        });
      },
    },
  );

  const handleDelete = (record: any) => {
    eliminarNotaDePedido(record.id);
  };

  const columns = [
    {
      title: t('common.numero'),
      dataIndex: 'numero',
      key: 'numero',
    },
    {
      title: t('common.fecha'),
      dataIndex: 'fecha',
      key: 'fecha',
      render: (text: any, record: any) => {
        return <span>{new Date(record.fecha).toLocaleString('es')}</span>;
      },
    },
    {
      title: t('common.vencimiento'),
      dataIndex: 'vencimiento',
      key: 'vencimiento',
      render: (text: any, record: any) => {
        return <span>{new Date(record.vencimiento).toLocaleString('es')}</span>;
      },
    },
    {
      title: t('common.usuario'),
      dataIndex: 'usuario',
      key: 'usuario',
    },
    {
      title: t('common.proveedor'),
      dataIndex: 'proveedor',
      key: 'proveedor',
    },
    {
      title: t('common.estadonp'),
      dataIndex: 'estadonp',
      key: 'estadonp',
      render: (text: any, record: any) => textoPorEstado(record.estadonp),
    },
    {
      title: t('common.tipocompra'),
      dataIndex: 'tipocompra',
      key: 'tipocompra',
      render: (text: any, record: any) => TipoCompra[record.tipocompra - 1],
    },
    {
      title: t('common.acciones'),
      width: '10%',
      key: 'acciones',
      render: (text: any, record: any) => (
        <Space>
          <Tooltip placement="top" title={t('common.actualizarEstado')} trigger="hover" destroyTooltipOnHide>
            <Button
              icon={<SubnodeOutlined />}
              disabled={!record.estado}
              type="text"
              onClick={() => {
                setModalEstado(true);
                setNotaPedido(record);
              }}
            ></Button>
          </Tooltip>
          <Tooltip placement="top" title={t('common.exportarPDF')} trigger="hover" destroyTooltipOnHide>
            <Button
              icon={<DownloadOutlined />}
              disabled={!record.estado}
              type="text"
              onClick={() => {
                console.log('exportarPDF');
              }}
            ></Button>
          </Tooltip>
          <Button
            icon={<EditOutlined />}
            disabled={record.estadonp > 1}
            type="text"
            onClick={() => {
              navigate(`/compras/np/${record.id}`);
            }}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            disabled={!record.estado}
            type="text"
            danger
            onClick={() => {
              setIsModalOpen(true);
              setNotaPedido(record);
            }}
          ></Button>
        </Space>
      ),
    },
  ];

  const npFiltradas = () => {
    const arr = notasDePedidoData
      ?.filter((np: NotaPedido) => {
        if (filterDates.length > 0) {
          const fecha = new Date(np.fecha);
          const fechaDesde = new Date(filterDates[0]);
          const fechaHasta = new Date(filterDates[1]);
          return fecha >= fechaDesde && fecha <= fechaHasta;
        }
        return true;
      })
      .filter((np: NotaPedido) => {
        if (filterExpiration.length > 0) {
          const fecha = new Date(np.vencimiento);
          const fechaDesde = new Date(filterExpiration[0]);
          const fechaHasta = new Date(filterExpiration[1]);
          return fecha >= fechaDesde && fecha <= fechaHasta;
        }
        return true;
      })
      .filter((np: NotaPedido) => {
        if (filterUsuario) {
          return np?.idUsuario === filterUsuario;
        }
        return true;
      })
      .filter((np: NotaPedido) => {
        if (filterProveedor) {
          return np?.idProveedor === filterProveedor;
        }
        return true;
      })
      .filter((np: NotaPedido) => {
        if (filterEstadoNP) {
          return np.idEstadoNP === filterEstadoNP;
        }
        return true;
      })
      .sort((a: NotaPedido, b: NotaPedido) => {
        return (a.id as number) - (b.id as number);
      });

    return arr;
  };

  const textoPorEstado = (estado: any) => {
    switch (estado) {
      case EstadoNP[0]:
        return t('common.pendienteAceptacion');
      case EstadoNP[1]:
        return t('common.pendienteEntrega');
      case EstadoNP[2]:
        return t('common.cerrada');
      case EstadoNP[3]:
        return t('common.rechazada');
      default:
        return '';
    }
  };

  return (
    <>
      <Modal
        title={t('notifications.eliminandoElemento')}
        visible={isModalOpen}
        onOk={() => {
          handleDelete(notaPedido);
        }}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoadingDelete}
        okText={t('common.confirmar')}
        cancelText={t('common.cancelar')}
      >
        <p>{t('notifications.confirmarEliminacion')}</p>
      </Modal>
      <Modal
        title={t('notifications.cambiandoEstado')}
        visible={modalEstado}
        onOk={() => {
          cambiarEstado();
        }}
        onCancel={() => setModalEstado(false)}
        okButtonProps={{ disabled: estado == null }}
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
          <div style={{ marginLeft: '3rem', marginRight: '1.2rem', width: '20%' }}>{t('common.nuevoEstado')}:</div>
          <Select
            placeholder={t('common.estado')}
            value={estado}
            onChange={(value) => setEstado(value)}
            allowClear
            style={{ width: '60%' }}
          >
            {EstadoNP?.filter((e) => e > estado).map((estado, i: number) => (
              <Select.Option key={i} value={estado}>
                {textoPorEstado(estado)}
              </Select.Option>
            ))}
          </Select>
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
        <h1 style={{ color: 'var(--timeline-background)' }}>{t('common.notapedido')}</h1>

        <Button
          style={{
            color: 'var(--success-color)',
            borderRadius: '2rem',
          }}
          className="success-button"
          icon={<PlusOutlined />}
          type="text"
          onClick={() => navigate('/compras/notapedido/alta')}
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
        <Typography.Text style={{ width: '30%', textAlign: 'right' }}>{t('table.filtrarFecha')}:</Typography.Text>
        <RangePicker
          showTime
          style={{ width: '100%', marginLeft: '1rem', marginRight: '1rem' }}
          locale={locale}
          value={filterDates}
          onChange={(value, dateString) => {
            setFilterDates(dateString);
          }}
        />
        <Typography.Text style={{ width: '30%', textAlign: 'right' }}>{t('table.filtrarVencimiento')}:</Typography.Text>
        <RangePicker
          showTime
          style={{ width: '100%', marginLeft: '1rem' }}
          locale={locale}
          value={filterExpiration}
          onChange={(value, dateString) => {
            setFilterExpiration(dateString);
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <Select
          value={filterUsuario}
          onChange={(value) => setFilterUsuario(value)}
          style={{ width: '100%', marginLeft: '1rem' }}
          placeholder={t('table.filtrarUsuario')}
          allowClear
        >
          {usuariosData?.map((usuario: Usuario, i: number) => (
            <Select.Option key={i} value={usuario?.id}>
              {usuario?.usuario}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={filterProveedor}
          onChange={(value) => setFilterProveedor(value)}
          style={{ width: '100%', marginLeft: '1rem' }}
          placeholder={t('table.filtrarProveedores')}
          allowClear
        >
          {proveedoresData?.map((proveedor: Proveedor, i: number) => (
            <Select.Option key={i} value={proveedor?.id}>
              {proveedor?.nombre}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={filterEstadoNP}
          onChange={(value) => setFilterEstadoNP(value)}
          style={{ width: '100%', marginLeft: '1rem' }}
          placeholder={t('table.filtrarEstado')}
          allowClear
        >
          {EstadoNP.map((estado, i: number) => (
            <Select.Option key={i} value={estado}>
              {textoPorEstado(estado)}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Table
        rowKey={(record) => record.id}
        rowClassName={(record) => (!record.estado ? 'deleted-row' : '')}
        columns={columns}
        dataSource={npFiltradas()}
        loading={isLoadingNotasDePedido || isLoadingProveedores || isLoadingUsuarios || isRefetchingNotasDePedido}
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

export const NotasDePedidoForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = React.useState(false);
  const [form] = Form.useForm();
  const { isDesktop } = useResponsive();

  const { data: proveedorData, isLoading: isLoadingProveedor } = useQuery(
    ['getProveedor'],
    () => getProveedor(parseInt(id as string)),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      enabled: !!id,
    },
  );

  const { mutate: handleCreate, isLoading } = useMutation(postProveedor, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.proveedorCreado'),
          duration: 3,
        });
        navigate('/compras/proveedores');
      } else {
        throw new Error('Error al crear proveedor');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.proveedorNoCreado'),
        duration: 3,
      });
    },
  });

  const { mutate: handleEdit, isLoading: isLoadingEdit } = useMutation(putProveedor, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.proveedorActualizado'),
          duration: 3,
        });
        navigate('/compras/proveedores');
      } else {
        throw new Error('Error al editar proveedor');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.proveedorNoActualizado'),
        duration: 3,
      });
    },
  });
  useEffect(() => {
    if (id && !isLoadingProveedor) {
      setIsEdit(true);
      form.setFieldsValue({
        id: id,
        nombre: proveedorData?.nombre,
        tipoiva: proveedorData?.tipoiva,
        tipoDocumento: proveedorData?.idtipodocumento,
        documento: proveedorData?.documento,
        direccion: proveedorData?.direccion,
        cp: proveedorData?.cp,
        telefono: proveedorData?.telefono,
        email: proveedorData?.email,
      });
    }
  }, [proveedorData, isLoadingProveedor, form, id]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      const proveedor = {
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
      handleEdit(proveedor);
    } else {
      const proveedor = {
        nombre: values.nombre,
        tipoiva: values.tipoiva,
        idtipodocumento: values.tipoDocumento,
        documento: values.documento,
        direccion: values.direccion,
        cp: values.cp,
        telefono: values.telefono,
        email: values.email,
      };
      handleCreate(proveedor);
    }
  };

  if (isLoadingProveedor && isEdit) {
    return <Spin />;
  }

  return (
    <div>
      <Row>
        {isDesktop ? (
          <Col offset={6} span={12}>
            <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
              <h1>{isEdit ? t('titles.editandoProveedor') : t('titles.creandoProveedor')}</h1>
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
                    rules={[{ required: true, message: t('common.requiredField') }]}
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
                    rules={[{ required: true, message: t('common.requiredField') }]}
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
              <h1>{isEdit ? t('titles.editandoProveedor') : t('titles.creandoProveedor')}</h1>
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
                    rules={[{ required: true, message: t('common.requiredField') }]}
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
                    rules={[{ required: true, message: t('common.requiredField') }]}
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
