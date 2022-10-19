import React, { useEffect } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined, SubnodeOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Proveedor, TiposIVA, TiposDocumento, NotaPedido, EstadoNP, TipoCompra, Usuario } from '@app/models/models';
import { useNavigate, useParams } from 'react-router';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import FormItem from 'antd/es/form/FormItem';
import { FormInput, SubmitButton } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { Table } from '@app/components/common/Table/Table';
import { getProveedores } from '../../../api/proveedores.api';
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
import { getProductos } from '@app/api/productos.api';

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
      title: t('common.plazoentrega'),
      dataIndex: 'plazoentrega',
      key: 'plazoentrega',
      render: (text: any, record: any) => {
        return <span>{record.plazoentrega + ' dias.'}</span>;
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
        okText={t('common.confirmar')}
        confirmLoading={isLoadingDelete}
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
  const [detalles, setDetalles] = React.useState([]);
  const [productos, setProductos] = React.useState([]);
  const [form] = Form.useForm();
  const { isDesktop } = useResponsive();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [searchProducto, setSearchProducto] = React.useState('');
  const [proveedor, setProveedor] = React.useState(null);
  const { data: proveedoresData, isLoading: isLoadingProveedores } = useQuery(['proveedores'], getProveedores, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });
  const { data: productosData, isLoading: isLoadingProductos } = useQuery(['productos'], getProductos, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setProductos(data);
    },
  });

  const { data: npData, isLoading: isLoadingNP } = useQuery(
    ['getNotaPedido'],
    () => getNotaPedido(parseInt(id as string)),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      enabled: !!id,
      onSuccess: (data) => {
        setIsEdit(true);
        form.setFieldsValue({
          id: id,
          nombre: data?.nombre,
          tipoiva: data?.tipoiva,
          tipoDocumento: data?.idtipodocumento,
          documento: data?.documento,
          direccion: data?.direccion,
          cp: data?.cp,
          telefono: data?.telefono,
          email: data?.email,
        });
      },
    },
  );

  const { mutate: handleCreate, isLoading } = useMutation(postNotaPedido, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.npCreada'),
          duration: 3,
        });
        navigate('/compras/notapedido');
      } else {
        throw new Error('Error al crear nota de pedido');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.npNoCreada'),
        duration: 3,
      });
    },
  });

  const { mutate: handleEdit, isLoading: isLoadingEdit } = useMutation(putNotaPedido, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.npActualizada'),
          duration: 3,
        });
        navigate('/compras/notapedido');
      } else {
        throw new Error('Error al editar nota de pedido');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.npNoActualizada'),
        duration: 3,
      });
    },
  });

  const handleSubmit = (values: any) => {
    if (isEdit) {
      const np = {
        id: parseInt(id as string),
        fecha: values?.fecha,
        idProveedor: values?.idProveedor,
        idTipoCompra: values?.idTipoCompra,
        plazoentrega: values?.plazoentrega,
        detalles: detalles.map((d: any) => {
          return {
            idProducto: d.id,
            cantidadPedida: d.cantidad,
            precio: parseInt(d.preciolista),
          };
        }),
      };
      handleEdit(np);
    } else {
      const np = {
        fecha: values?.fecha,
        idProveedor: values?.idProveedor,
        idTipoCompra: values?.idTipoCompra,
        plazoentrega: values?.plazoentrega,
        detalles: detalles.map((d: any) => {
          return {
            idProducto: d.id,
            cantidadPedida: d.cantidad,
            precio: parseInt(d.preciolista),
          };
        }),
      };
      handleCreate(np);
    }
  };

  // #region Productos

  const columns = [
    {
      title: t('common.id'),
      dataIndex: 'id',
      key: 'id',
      width: '5%',
    },
    {
      title: t('common.nombre'),
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: t('common.importeunitario'),
      dataIndex: 'preciolista',
      key: 'preciolista',
      width: '5%',
    },
    {
      title: t('common.iva'),
      key: 'iva',
      width: '5%',
      render: (text: any, record: any) => {
        return <span>{record.preciolista * 0.21}</span>;
      },
    },
    {
      title: t('common.cantidad'),
      dataIndex: 'cantidad',
      key: 'cantidad',
      width: '5%',
    },
    {
      title: t('common.importetotal'),
      key: 'importetotal',
      width: '5%',
      render: (text: any, record: any) => {
        return <span>{record.preciolista * record.cantidad * 1.21}</span>;
      },
    },
    {
      title: t('common.acciones'),
      width: '10%',
      key: 'acciones',
      render: (text: any, record: any) => (
        <Space>
          <Button
            icon={<DeleteOutlined />}
            disabled={!record.estado}
            type="text"
            danger
            onClick={() => {
              removeProducto(record);
            }}
          ></Button>
        </Space>
      ),
    },
  ];

  const agregarProductosColumnas = [
    {
      title: t('common.id'),
      dataIndex: 'id',
      key: 'id',
      width: '5%',
    },
    {
      title: t('common.nombre'),
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: t('common.importeunitario'),
      dataIndex: 'preciolista',
      key: 'preciolista',
      width: '5%',
    },
    {
      title: t('common.cantidad'),
      dataIndex: 'cantidad',
      key: 'cantidad',
      width: '5%',
      render: (text: any, record: any) => {
        return (
          <InputNumber
            min={0}
            max={record.stock}
            defaultValue={0}
            value={(productos as any).find((p: any) => p.id === record.id)?.cantidad}
            onChange={(value) => {
              const newProductos = productos.map((p: any) => {
                if (p.id === record.id) {
                  return {
                    ...p,
                    cantidad: value,
                  };
                } else {
                  return p;
                }
              });
              setProductos(newProductos as any);
            }}
          />
        );
      },
    },
  ];

  const agregarProductos = () => {
    const filteredProductos = productos?.filter((p: any) => p.cantidad || p.cantidad > 0);
    setDetalles(filteredProductos);
    setModalVisible(false);
  };

  const removeProducto = (record: any) => {
    const newDetalles = detalles.filter((d: any) => d.id !== record.id);
    setDetalles(newDetalles);
  };

  const filteredProductos = () => {
    const arr = productosData?.filter(
      (p: any) =>
        p.nombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
        p.id.toString().toLowerCase().includes(searchProducto.toLowerCase()),
    );

    return arr;
  };

  if (isLoadingNP && isEdit) {
    return <Spin />;
  }

  return (
    <div>
      {/* #region Formulario  */}
      <Row>
        <Col span={24}>
          <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
            <Row justify="space-between">
              <h1>{isEdit ? t('titles.editandoNP') : t('titles.creandoNP')}</h1>
              <BaseForm.Item>
                <SubmitButton
                  type="primary"
                  htmlType="submit"
                  loading={isLoading || isLoadingEdit}
                  disabled={!detalles || detalles.length === 0}
                >
                  {isEdit ? t('common.editar') : t('common.confirmar')}
                </SubmitButton>
              </BaseForm.Item>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem
                  requiredMark
                  name="fecha"
                  label={t('common.fecha')}
                  rules={[{ required: true, message: t('common.requiredField') }]}
                >
                  <DatePicker showToday style={{ width: '100%' }} locale={locale} />
                </FormItem>
              </Col>
              <Col span={6} offset={1}>
                <FormItem
                  requiredMark
                  name="plazoentrega"
                  label={t('common.plazoentrega')}
                  rules={[{ required: true, message: t('common.requiredField') }]}
                >
                  <InputNumber addonAfter="días." style={{ width: '100%' }} />
                </FormItem>
              </Col>
            </Row>
            <Row
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Col span={6}>
                <FormItem
                  requiredMark
                  name="idProveedor"
                  label={t('common.proveedores')}
                  rules={[{ required: true, message: t('common.requiredField') }]}
                >
                  <Select
                    allowClear
                    disabled={isEdit}
                    onChange={(value) => {
                      setProveedor(value);
                    }}
                  >
                    {proveedoresData?.map((proveedor: Proveedor, i: number) => (
                      <Select.Option key={i} value={proveedor?.id}>
                        {proveedor?.nombre}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={6} offset={1}>
                <FormItem
                  requiredMark
                  name="idTipoCompra"
                  label={t('common.tipocompra')}
                  rules={[{ required: true, message: t('common.requiredField') }]}
                >
                  <Select allowClear>
                    {TipoCompra.map((tc, i) => (
                      <Select.Option key={i} value={i + 1}>
                        {tc}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>

              <Col offset={9} span={1}>
                <Button
                  style={{
                    color: 'var(--success-color)',
                    borderRadius: '2rem',
                  }}
                  className="success-button"
                  icon={<PlusOutlined />}
                  type="text"
                  disabled={!proveedor}
                  onClick={() => {
                    setModalVisible(true);
                  }}
                ></Button>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  rowKey={(record) => record.id}
                  rowClassName={(record) => (!record.estado ? 'deleted-row' : '')}
                  columns={columns}
                  dataSource={detalles}
                  loading={isEdit && isLoadingNP}
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
              </Col>
            </Row>
          </BaseForm>
        </Col>
      </Row>
      {/* #region Agregado de Productos  */}
      <Modal
        width={1000}
        title={t('notifications.agregandoProductos')}
        visible={modalVisible}
        onOk={() => {
          agregarProductos();
        }}
        onCancel={() => setModalVisible(false)}
        okText={t('common.agregarProductos')}
        cancelText={t('common.cancelar')}
      >
        <Row>
          <Col span={24}>
            <Input
              placeholder={t('table.buscarProducto')}
              value={searchProducto}
              onChange={(e) => setSearchProducto(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Table
          rowKey={(record) => record.id}
          rowClassName={(record) => (!record.estado ? 'deleted-row' : '')}
          columns={agregarProductosColumnas}
          dataSource={filteredProductos()}
          loading={isLoadingProductos}
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
      </Modal>
    </div>
  );
};
