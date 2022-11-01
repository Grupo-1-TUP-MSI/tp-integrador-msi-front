import React, { useEffect } from 'react';
import {
  Button,
  Checkbox,
  Col,
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
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  agregarProveedores,
  deleteProducto,
  getProducto,
  getProductos,
  postProducto,
  putProducto,
  updateStock,
} from '@app/api/productos.api';
import { Producto, Proveedor } from '@app/models/models';
import { useLocation, useNavigate, useParams } from 'react-router';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import FormItem from 'antd/es/form/FormItem';
import { FormInput, SubmitButton } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { Table } from '@app/components/common/Table/Table';
import { useResponsive } from '@app/hooks/useResponsive';
import { getProveedores } from '@app/api/proveedores.api';
import { BotonCSV } from '@app/components/shared/BotonCSV';

export const ProductosPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchProducto, setSearchProducto] = React.useState('');
  const [minPrecio, setMinPrecio] = React.useState(0);
  const [maxPrecio, setMaxPrecio] = React.useState(0);
  const [filterStock, setFilterStock] = React.useState(false);
  const [filterStockMinimo, setFilterStockMinimo] = React.useState(false);
  const [filterEstado, setFilterEstado] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [producto, setProducto] = React.useState<Producto | null>(null);
  const [modalStockOpen, setModalStockOpen] = React.useState(false);
  const [newStock, setNewStock] = React.useState(0);
  const [modalProveedor, setModalProveedor] = React.useState(false);
  const [proveedor, setProveedor] = React.useState(null);
  const [nuevoPrecio, setNuevoPrecio] = React.useState(0);
  const { isDesktop } = useResponsive();

  useEffect(() => {
    if (!!state) {
      const { description } = state as any;
      setSearchProducto(description || '');
    }
  }, [state]);

  const {
    data: productosData,
    isLoading: isLoadingProductos,
    refetch: refetchProductos,
    isRefetching: isRefetchingProductos,
  } = useQuery(['productos'], getProductos, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });
  const {
    data: proveedoresData,
    isLoading: isLoadingProveedores,
    isRefetching: isRefetchingProveedores,
  } = useQuery(['proveedores'], getProveedores, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: eliminarProducto, isLoading: isLoadingDelete } = useMutation(deleteProducto, {
    onSuccess: (res) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.productoEliminado'),
          duration: 3,
        });
        setIsModalOpen(false);
        refetchProductos();
      } else {
        throw new Error('Error al eliminar producto');
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.productoNoEliminado'),
        duration: 3,
      });
    },
  });

  const { mutate: actualizarStock, isLoading: isLoadingStock } = useMutation(
    ['updateStock'],
    () => updateStock(producto?.id as number, newStock),
    {
      onSuccess: (res) => {
        if (res !== 400) {
          notificationController.success({
            message: t('common.successMessage'),
            description: t('notifications.productoActualizado'),
            duration: 3,
          });
          setModalStockOpen(false);
          refetchProductos();
        } else {
          throw new Error('Error al actualizar producto');
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onError: (error: Error) => {
        notificationController.error({
          message: t('common.errorMessage'),
          description: t('notifications.productoNoActualizado'),
          duration: 3,
        });
      },
    },
  );

  const { mutate: addProveedores, isLoading: isLoadingAgregarProveedores } = useMutation(
    ['agregarProveedores'],
    () => agregarProveedores(producto?.id as number, parseInt(`${proveedor}`), nuevoPrecio),
    {
      onSuccess: (res) => {
        if (res !== 400) {
          notificationController.success({
            message: t('common.successMessage'),
            description: t('notifications.proveedoresActualizados'),
            duration: 3,
          });
          setModalProveedor(false);
          setProveedor(null);
          setNuevoPrecio(0);
          refetchProductos();
        } else {
          throw new Error('Error al actualizar producto');
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onError: (error: Error) => {
        notificationController.error({
          message: t('common.errorMessage'),
          description: t('notifications.proveedoresNoActualizados'),
          duration: 3,
        });
      },
    },
  );

  const handleDelete = (record: any) => {
    eliminarProducto(record.id);
  };

  const columns = [
    {
      title: t('common.id'),
      dataIndex: 'id',
      width: '5%',
    },
    {
      title: t('common.nombre'),
      dataIndex: 'nombre',
      key: 'nombre',
      width: '40%',
      render: (text: any, record: any) => (
        <>
          {record.descripcion && (
            <Tooltip placement="top" title={record.descripcion} trigger="hover" destroyTooltipOnHide>
              <InfoCircleOutlined style={{ opacity: '0.4' }} />
            </Tooltip>
          )}
          <span style={{ marginLeft: '1rem' }}>{record.nombre}</span>
        </>
      ),
    },
    {
      title: t('common.precio'),
      dataIndex: 'preciolista',
      key: 'preciolista',
      width: '10%',
      render: (text: any, record: any) => <span>ARS ${record.preciolista}</span>,
    },
    {
      title: t('common.stockminimo'),
      dataIndex: 'stockminimo',
      key: 'stockminimo',
    },
    {
      title: t('common.stock'),
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: t('common.acciones'),
      width: '10%',
      key: 'acciones',
      render: (text: any, record: any) => (
        <Space>
          <Tooltip placement="top" title={t('common.actualizarStock')} trigger="hover" destroyTooltipOnHide>
            <Button
              icon={<PlusCircleOutlined />}
              disabled={!record.estado}
              type="text"
              onClick={() => {
                setModalStockOpen(true);
                setProducto(record);
              }}
            ></Button>
          </Tooltip>
          <Tooltip placement="top" title={t('common.agregarProveedor')} trigger="hover" destroyTooltipOnHide>
            <Button
              icon={<UsergroupAddOutlined />}
              disabled={!record.estado}
              type="text"
              onClick={() => {
                setModalProveedor(true);
                setProducto(record);
              }}
            ></Button>
          </Tooltip>
          <Button
            icon={<EditOutlined />}
            disabled={!record.estado}
            type="text"
            onClick={() => {
              navigate(`/productos/${record.id}`);
            }}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            disabled={!record.estado}
            type="text"
            danger
            onClick={() => {
              setIsModalOpen(true);
              setProducto(record);
            }}
          ></Button>
        </Space>
      ),
    },
  ];

  const productosFiltrados = () => {
    const arr = productosData
      ?.filter((producto: Producto) => {
        return producto.nombre.toLowerCase().includes(searchProducto.toLowerCase());
      })
      .filter((producto: Producto) => {
        return !!filterEstado ? producto.estado === filterEstado : true;
      })
      .filter((producto: Producto) => {
        return !!filterStockMinimo ? producto.stockminimo > (producto.stock || 0) : true;
      })
      .filter((producto: Producto) => {
        return !!filterStock ? producto.stock || 0 > 0 : true;
      })
      .filter((producto: Producto) => {
        return !!minPrecio ? producto.preciolista >= minPrecio : true;
      })
      .filter((producto: Producto) => {
        return !!maxPrecio ? producto.preciolista <= maxPrecio : true;
      })
      .sort((a: Producto, b: Producto) => {
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
          handleDelete(producto);
        }}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoadingDelete}
        okText={t('common.confirmar')}
        cancelText={t('common.cancelar')}
      >
        <p>{t('notifications.confirmarEliminacion')}</p>
      </Modal>
      <Modal
        title={t('notifications.agregandoProveedor', { producto: producto?.nombre })}
        visible={modalProveedor}
        onOk={() => addProveedores()}
        onCancel={() => setModalProveedor(false)}
        confirmLoading={isLoadingAgregarProveedores}
        okButtonProps={{ disabled: !proveedor }}
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
          <div style={{ marginLeft: '3rem', marginRight: '1.2rem', width: '20%' }}>{t('common.nuevoProveedor')}:</div>
          <Select
            placeholder={t('common.proveedor')}
            value={proveedor}
            onChange={(value) => setProveedor(value)}
            allowClear
            loading={isLoadingProveedores || isRefetchingProveedores}
            style={{ width: '60%' }}
          >
            {proveedoresData
              ?.filter((p: any) => {
                return p.estado !== false;
              })
              ?.map((proveedor: Proveedor, i: number) => (
                <Select.Option key={i} value={proveedor.id}>
                  {proveedor.id + ' - ' + proveedor.nombre}
                </Select.Option>
              ))}
          </Select>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            marginBottom: '10px',
          }}
        >
          <div style={{ marginLeft: '3rem', marginRight: '1.2rem', width: '20%' }}>{t('common.nuevoPrecio')}:</div>
          <InputNumber min={0} value={nuevoPrecio} onChange={setNuevoPrecio} />
        </div>
        <Typography.Text
          type="secondary"
          italic
          style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'end',
            textAlign: 'end',
            fontSize: '0.8rem',
          }}
        >
          {t('notifications.captionPrecio')}
        </Typography.Text>
      </Modal>
      <Modal
        title={t('notifications.actualizandoStock')}
        visible={modalStockOpen}
        onOk={() => actualizarStock()}
        onCancel={() => setModalStockOpen(false)}
        confirmLoading={isLoadingStock}
        okText={t('common.confirmar')}
        cancelText={t('common.cancelar')}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ marginLeft: '3rem', marginRight: '1.2rem' }}>{t('common.newStock')}:</div>
          <InputNumber min={0} value={newStock} onChange={setNewStock} />
        </div>
      </Modal>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h1 style={{ color: 'var(--timeline-background)' }}>{t('common.productos')}</h1>

        <div>
          <Button
            style={{
              color: 'var(--success-color)',
              borderRadius: '2rem',
            }}
            className="success-button"
            icon={<PlusOutlined />}
            type="text"
            onClick={() => navigate('/productos/alta')}
          ></Button>
          <BotonCSV list={productosFiltrados()} fileName={'productos'} />
        </div>
      </div>
      {!isDesktop ? (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Input
              placeholder={t('table.buscarProducto')}
              value={searchProducto}
              onChange={(e) => setSearchProducto(e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ marginLeft: '3rem', marginRight: '1.2rem' }}>{t('common.precio')}:</div>
            <InputNumber placeholder="Min" style={{ width: '150px' }} value={minPrecio} onChange={setMinPrecio} />
            <div style={{ marginLeft: '0.8rem', marginRight: '0.8rem' }}>-</div>
            <InputNumber placeholder="Max" style={{ width: '150px' }} value={maxPrecio} onChange={setMaxPrecio} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Checkbox checked={filterStockMinimo} onChange={(e) => setFilterStockMinimo(e.target.checked)}>
              {t('common.verStockMinimo')}
            </Checkbox>
            <Checkbox checked={filterStock} onChange={(e) => setFilterStock(e.target.checked)}>
              {t('common.verSinStock')}
            </Checkbox>
            <Checkbox checked={filterEstado} onChange={(e) => setFilterEstado(e.target.checked)}>
              {t('common.verBorrados')}
            </Checkbox>
          </div>
        </>
      ) : (
        <div
          style={{
            display: 'grid',
            gridGap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Input
              placeholder={t('table.buscarProducto')}
              value={searchProducto}
              onChange={(e) => setSearchProducto(e.target.value)}
            />
            <div style={{ marginLeft: '3rem', marginRight: '1.2rem' }}>{t('common.precio')}:</div>
            <InputNumber placeholder="Min" style={{ width: '150px' }} value={minPrecio} onChange={setMinPrecio} />
            <div style={{ marginLeft: '0.8rem', marginRight: '0.8rem' }}>-</div>
            <InputNumber placeholder="Max" style={{ width: '150px' }} value={maxPrecio} onChange={setMaxPrecio} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Checkbox checked={filterStockMinimo} onChange={(e) => setFilterStockMinimo(e.target.checked)}>
              {t('common.verStockMinimo')}
            </Checkbox>
            <Checkbox checked={filterStock} onChange={(e) => setFilterStock(e.target.checked)}>
              {t('common.verSinStock')}
            </Checkbox>
            <Checkbox checked={filterEstado} onChange={(e) => setFilterEstado(e.target.checked)}>
              {t('common.verBorrados')}
            </Checkbox>
          </div>
        </div>
      )}
      <Table
        rowKey={(record) => record.id}
        rowClassName={(record) => (!record.estado ? 'deleted-row' : record.stock < 0 ? 'no-stock-row' : '')}
        columns={columns}
        dataSource={productosFiltrados()}
        loading={isLoadingProductos || isRefetchingProductos}
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

export const ProductosForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = React.useState(false);
  const [form] = Form.useForm();

  const { data: productoData, isLoading: isLoadingProducto } = useQuery(
    ['getProducto'],
    () => getProducto(parseInt(id as string)),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      enabled: !!id,
    },
  );

  const { mutate: handleCreate, isLoading } = useMutation(postProducto, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.productoCreado'),
          duration: 3,
        });
        navigate('/productos');
      } else {
        throw new Error('Error al crear producto');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.productoNoCreado'),
        duration: 3,
      });
    },
  });

  const { mutate: handleEdit, isLoading: isLoadingEdit } = useMutation(putProducto, {
    onSuccess: (res: any) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.productoActualizado'),
          duration: 3,
        });
        navigate('/productos');
      } else {
        throw new Error('Error al editar producto');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.productoNoActualizado'),
        duration: 3,
      });
    },
  });

  useEffect(() => {
    if (id && !isLoadingProducto) {
      setIsEdit(true);
      form.setFieldsValue({
        id: id,
        nombre: productoData?.nombre,
        descripcion: productoData?.descripcion,
        preciolista: productoData?.preciolista,
        stockminimo: productoData?.stockminimo,
      });
    }
  }, [productoData, isLoadingProducto, form, id]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      const producto = {
        id: parseInt(id as string),
        nombre: values.nombre,
        descripcion: values.descripcion,
        preciolista: parseInt(values.preciolista),
        stockminimo: parseInt(values.stockminimo),
      };
      handleEdit(producto);
    } else {
      const producto = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        preciolista: parseInt(values.preciolista),
        stockminimo: parseInt(values.stockminimo),
      };
      handleCreate(producto);
    }
  };

  if (isLoadingProducto && isEdit) {
    return <Spin />;
  }

  return (
    <div>
      <Row>
        <Col offset={6} span={12}>
          <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
            <h1>{isEdit ? t('titles.editandoProducto') : t('titles.creandoProducto')}</h1>
            <FormItem
              name="nombre"
              label={t('common.nombre')}
              rules={[{ required: true, message: t('common.requiredField') }]}
              requiredMark
            >
              <FormInput />
            </FormItem>
            <FormItem name="descripcion" label={t('common.descripcion')} requiredMark>
              <FormInput />
            </FormItem>
            <Row>
              <Col span={11}>
                <FormItem
                  requiredMark
                  name="preciolista"
                  label={t('common.precio')}
                  rules={[{ required: true, message: t('common.requiredField') }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} />
                </FormItem>
              </Col>
              <Col span={11} offset={2}>
                <FormItem
                  requiredMark
                  name="stockminimo"
                  label={t('common.stockminimo')}
                  rules={[{ required: true, message: t('common.requiredField') }]}
                >
                  <InputNumber style={{ width: '100%' }} min={1} />
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
      </Row>
    </div>
  );
};
