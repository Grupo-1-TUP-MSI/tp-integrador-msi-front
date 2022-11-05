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
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import {
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  RightOutlined,
  SubnodeOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Proveedor, EstadoNP, TipoCompra, Usuario } from '@app/models/models';
import { useLocation, useNavigate, useParams } from 'react-router';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import FormItem from 'antd/es/form/FormItem';
import { SubmitButton } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { getProveedores } from '../../../api/proveedores.api';
import {
  getNotasPedidos,
  getNotaPedido,
  postNotaPedido,
  putNotaPedido,
  putEstado,
  getNotaPedidoPDF,
} from '@app/api/notasPedido.api';
import { getUsuarios } from '@app/api/usuarios.api';
import localeES from 'antd/es/date-picker/locale/es_ES';
import localeEN from 'antd/es/date-picker/locale/en_US';
import localePT from 'antd/es/date-picker/locale/pt_BR';
import { getProductosDeProveedor } from '@app/api/productos.api';
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from 'jspdf-invoice-template';
import { BotonCSV } from '@app/components/shared/BotonCSV';
import { useResponsive } from '@app/hooks/useResponsive';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

export const NotasDePedidoPage: React.FC = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [locale, setLocale] = React.useState(() =>
    i18n.language === 'es' ? localeES : i18n.language === 'en' ? localeEN : localePT,
  );

  useEffect(() => {
    setLocale(i18n.language === 'es' ? localeES : i18n.language === 'en' ? localeEN : localePT);
  }, [i18n.language]);
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [notaPedido, setNotaPedido] = React.useState<any>(null);
  const [filterUsuario, setFilterUsuario] = React.useState(null);
  const [filterProveedor, setFilterProveedor] = React.useState(null);
  const [filterEstadoNP, setFilterEstadoNP] = React.useState<number | null>(null);
  const [filterTipoCompra, setFilterTipoCompra] = React.useState<number | null>(null);
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

  const { mutate: cambiarEstado, isLoading: isLoadingCambiarEstado } = useMutation(
    () => putEstado(notaPedido?.id, estado),
    {
      onSuccess: (res) => {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.cambioEstadoNP'),
          duration: 3,
        });
        setModalEstado(false);
        refetchNotasDePedido();
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

  const columns = [
    {
      title: t('common.numero'),
      dataIndex: 'id',
      key: 'id',

      sorter: (a: any, b: any) => a.id - b.id,
      render: (text: any, record: any) => {
        return (
          <span>
            {record.id}
            {record.version > 1 ? `.${record.version}` : ''}
          </span>
        );
      },
    },
    {
      title: t('common.fecha'),
      dataIndex: 'fecha',
      key: 'fecha',

      sorter: (a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
      render: (text: any, record: any) => {
        return <span>{new Date(record.fecha).toLocaleDateString('es')}</span>;
      },
    },
    {
      title: t('common.vencimiento'),
      dataIndex: 'vencimiento',
      key: 'vencimiento',

      sorter: (a: any, b: any) => new Date(a.vencimiento).getTime() - new Date(b.vencimiento).getTime(),
      render: (text: any, record: any) => {
        return <span>{new Date(record.vencimiento).toLocaleDateString('es')}</span>;
      },
    },
    {
      title: t('common.usuario'),
      dataIndex: 'usuario',
      key: 'usuario',

      sorter: (a: any, b: any) => a.usuario.localeCompare(b.usuario),
    },
    {
      title: t('common.proveedor'),
      dataIndex: 'proveedor',
      key: 'proveedor',

      sorter: (a: any, b: any) => a.proveedor.localeCompare(b.proveedor),
    },
    {
      title: t('common.estadonp'),
      dataIndex: 'idestadonp',
      key: 'idestadonp',

      sorter: (a: any, b: any) => a.idestadonp - b.idestadonp,
      render: (text: any, record: any) => t('common.' + EstadoNP[record.idestadonp - 1]),
    },
    {
      title: t('common.tipocompra'),
      dataIndex: 'idtipocompra',
      key: 'idtipocompra',

      sorter: (a: any, b: any) => a.idtipocompra - b.idtipocompra,
      render: (text: any, record: any) => TipoCompra[record.idtipocompra - 1],
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
              disabled={record.idestadonp > 1}
              type="text"
              onClick={() => {
                navigate(`/compras/notapedido/${record.id}`);
              }}
            ></Button>
          </Tooltip>
          <Tooltip placement="top" title={t('common.actualizarEstado')} trigger="hover" destroyTooltipOnHide>
            <Button
              size="small"
              icon={<SubnodeOutlined />}
              disabled={record.idestadonp === 3 || record.idestadonp === 4}
              type="text"
              onClick={() => {
                setModalEstado(true);
                setNotaPedido(record);
              }}
            ></Button>
          </Tooltip>
          <Tooltip placement="top" title={t('common.exportarPDF')} trigger="hover" destroyTooltipOnHide>
            <Button
              size="small"
              icon={<DownloadOutlined />}
              type="text"
              onClick={() => {
                imprimirPDF(record.id);
              }}
            ></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (notaPedido: any) => {
    const columns = [
      {
        title: t('common.detalles'),
        dataIndex: 'producto',
        key: 'producto',

        sorter: (a: any, b: any) => a.producto.localeCompare(b.producto),
      },
      {
        title: t('common.importeunitario'),
        dataIndex: 'precio',
        key: 'precio',
        width: '10%',

        sorter: (a: any, b: any) => a.precio - b.precio,
        render: (text: any, record: any) => {
          return <span>${record.precio}</span>;
        },
      },
      {
        title: t('common.iva'),
        key: 'iva',
        width: '10%',

        sorter: (a: any, b: any) => Math.round(a.precio * 0.21) - Math.round(b.precio * 0.21),
        render: (text: any, record: any) => {
          return <span>${Math.round(record.precio * 0.21)}</span>;
        },
      },
      {
        title: t('common.cantidad'),
        dataIndex: 'cantidadpedida',
        key: 'cantidadpedida',
        width: '10%',

        sorter: (a: any, b: any) => a.cantidadpedida - b.cantidadpedida,
      },
      {
        title: t('common.importetotal'),
        key: 'importetotal',
        width: '10%',

        sorter: (a: any, b: any) =>
          Math.round(a.precio * a.cantidadpedida * 1.21) - Math.round(b.precio * b.cantidadpedida * 1.21),
        render: (text: any, record: any) => {
          return <span>${Math.round(record.precio * record.cantidadpedida * 1.21)}</span>;
        },
      },
    ];

    const data = notaPedido?.detalles;

    return (
      <Table
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={isLoadingNotasDePedido || isLoadingProveedores || isLoadingUsuarios || isRefetchingNotasDePedido}
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
    );
  };

  const expandIcon = (props: any) => {
    if (props.expanded) {
      return (
        <a
          onClick={(e) => {
            props.onExpand(props.record, e);
          }}
        >
          <DownOutlined />
        </a>
      );
    } else {
      return (
        <a
          onClick={(e) => {
            props.onExpand(props.record, e);
          }}
        >
          <RightOutlined />
        </a>
      );
    }
  };

  const imprimirPDF = async (id: number) => {
    const data = await getNotaPedidoPDF(id);
    const props: any = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: `ColorCor NP00${data.id}-V00${data.version}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: 'https://i.ibb.co/6r9YkfP/logo.png',
        width: 25, //aspect ratio = width/height
        height: 25,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      stamp: {
        inAllPages: true,
        src: '',
        width: 20, //aspect ratio = width/height
        height: 20,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      business: {
        name: 'ColorCor S.A.',
        address: 'Zapiola 77',
        phone: '(0351) 155622138',
        email: 'compras@colorcor.com.ar',

        website: 'https://colorcor.netlify.app/',
      },
      contact: {
        label: t('common.notaDePedidoPara'),
        name: data.proveedor.nombre,
        address: data.proveedor.direccion,
        phone: data.proveedor.telefono,
        email: data.proveedor.email,
      },
      invoice: {
        label: t('common.notaDePedidoN'),
        num: `${data.id}.${data.version}`,
        invDate: `${t('common.fechaElaboracion')}${data.fechaLocale}`,
        invGenDate: `${t('common.fechaEntrega')}${data.vencimientoLocale}`,
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          {
            title: '#',
            style: {
              width: 10,
            },
          },
          {
            title: t('common.producto'),
            style: {
              width: 30,
            },
          },
          {
            title: t('common.descripcion'),
            style: {
              width: 70,
            },
          },
          { title: t('common.importeunitario') },
          { title: t('common.cantidad') },
          { title: t('common.importetotal') },
        ],
        table: Array.from(data.detalles, (item: any, index) => [
          index + 1,
          item.producto,
          item.descripcion,
          item.precio.toLocaleString(),
          item.cantidadpedida,
          (parseFloat(item.precio) * parseFloat(item.cantidadpedida)).toLocaleString(),
        ]),
        additionalRows: [
          {
            col1: t('common.subtotal'),
            col2: data.acumGravado.toLocaleString(),
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: t('common.iva'),
            col2: data.acumIVA.toLocaleString(),
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: t('common.importetotal'),
            col2: data.acumTotal.toLocaleString(),
            style: {
              fontSize: 14, //optional, default 12
            },
          },
        ],
      },
      footer: {
        text: t('common.notaPedidoFooter'),
      },
      pageEnable: true,
      pageLabel: 'Page ',
    };
    const pdfObj = jsPDFInvoiceTemplate(props);
  };

  const npFiltradas = () => {
    const arr = notasDePedidoData
      ?.filter((np: any) => {
        if (filterDates?.length > 0) {
          const fecha = new Date(np.fecha);
          const fechaDesde = new Date(filterDates[0]?.format());
          const fechaHasta = new Date(filterDates[1]?.format());
          return fecha >= fechaDesde && fecha <= fechaHasta;
        }
        return true;
      })
      .filter((np: any) => {
        if (filterUsuario) {
          return np?.idUsuario === filterUsuario;
        }
        return true;
      })
      .filter((np: any) => {
        if (filterProveedor) {
          return np?.idproveedor === filterProveedor;
        }
        return true;
      })
      .filter((np: any) => {
        if (filterTipoCompra) {
          return np?.idtipocompra === filterTipoCompra;
        }
        return true;
      })
      .filter((np: any) => {
        if (filterEstadoNP) {
          return np.idestadonp === filterEstadoNP;
        }
        return true;
      })
      .sort((a: any, b: any) => {
        return (a.id as number) - (b.id as number);
      });

    return arr;
  };

  return (
    <>
      <PageTitle>{t('common.notapedido')}</PageTitle>
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
            {EstadoNP.map((estado, i: number) => {
              if (i + 1 <= notaPedido?.idestadonp) return null;
              return (
                <Select.Option key={i} value={i + 1}>
                  {t(`common.${EstadoNP[i]}`)}
                </Select.Option>
              );
            })}
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
        <h1 style={{ color: 'var(--timeline-background)', fontSize: '25px' }}>{t('common.notapedido')}</h1>

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
              onClick={() => navigate('/compras/notapedido/alta')}
            ></Button>
          </Tooltip>
          <BotonCSV list={npFiltradas()} fileName={'notasDePedido'} />
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
        <Typography.Text style={{ width: '30%', textAlign: 'right' }}>{t('table.filtrarFecha')}:</Typography.Text>
        <RangePicker
          allowClear
          style={{ width: '100%', marginLeft: '1rem', marginRight: '1rem' }}
          format="DD/MM/YYYY"
          locale={locale}
          value={filterDates}
          onChange={(value) => {
            setFilterDates(value);
          }}
        />
        <Typography.Text style={{ width: '30%', textAlign: 'right' }}>{t('table.filtrarVencimiento')}:</Typography.Text>
        <RangePicker
          allowClear
          style={{ width: '100%', marginLeft: '1rem' }}
          format="DD/MM/YYYY"
          locale={locale}
          value={filterExpiration}
          onChange={(value) => {
            setFilterExpiration(value);
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
              {usuario?.nombrecompleto}
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
          value={filterTipoCompra}
          onChange={(value) => setFilterTipoCompra(value)}
          style={{ width: '100%', marginLeft: '1rem' }}
          placeholder={t('table.filtrarTiposCompra')}
          allowClear
        >
          {TipoCompra.map((estado, i: number) => (
            <Select.Option key={i} value={i + 1}>
              {t(`common.${TipoCompra[i]}`)}
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
            <Select.Option key={i} value={i + 1}>
              {t(`common.${EstadoNP[i]}`)}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Table
        size="small"
        rowKey={(record) => record.id}
        rowClassName={(record) => (record.idestadonp === 4 ? 'deleted-row' : '')}
        expandable={{ expandedRowRender, expandIcon }}
        columns={columns}
        dataSource={npFiltradas()}
        pagination={{
          pageSizeOptions: ['5', '10', '20'],
          showSizeChanger: true,
          locale: {
            items_per_page: t('common.pagina'),
          },
        }}
        loading={isLoadingNotasDePedido || isLoadingProveedores || isLoadingUsuarios || isRefetchingNotasDePedido}
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

export const NotasDePedidoForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state }: any = useLocation();
  const productosComparativa = state?.productos;
  const [isEdit, setIsEdit] = React.useState(false);
  const [detalles, setDetalles] = React.useState<any>([]);
  const [productos, setProductos] = React.useState([]);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [searchProducto, setSearchProducto] = React.useState('');
  const [proveedor, setProveedor] = React.useState(null);
  const enabledField = Form.useWatch('idProveedor', form);
  const [isImprimirPDF, setImprimirPDF] = React.useState(false);
  const { isTablet } = useResponsive();

  React.useEffect(() => {
    if (productosComparativa) {
      const productosComparativaFormateados = productosComparativa?.map((producto: any) => {
        return {
          ...producto,
          id: producto.idproducto,
          cantidad: 1,
          precio: producto.precio,
          productoNombre: producto.nombre,
        };
      });
      setDetalles(productosComparativaFormateados);
      setProveedor(productosComparativa[0].idproveedor);
      form.setFieldValue('idProveedor', productosComparativa[0].idproveedor);
    }
  }, [productosComparativa]);

  const { data: proveedoresData, isLoading: isLoadingProveedores } = useQuery(['proveedores'], getProveedores, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: productosDeProveedorData,
    isLoading: isLoadingProductosDeProveedor,
    refetch: productosDeProveedorRefetch,
  } = useQuery(['productoDeProveedor'], () => getProductosDeProveedor(form.getFieldValue('idProveedor')), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    enabled: !!enabledField && !isEdit,
    onSuccess: (data) => {
      const newProductos = data?.map((producto: any) => {
        return {
          ...producto,
          cantidad: detalles?.find((detalle: any) => detalle.id === producto.idproducto)?.cantidad || 0,
        };
      });
      setProductos(newProductos);
      const newDetalles = detalles?.filter((detalle: any) => proveedor === detalle.idproveedor);
      setDetalles(newDetalles);
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
          id: data.id,
          fecha: data?.fecha,
          idProveedor: data?.idproveedor,
          idTipoCompra: data?.idtipocompra,
          plazoentrega: data?.plazoentrega,
        });
        setDetalles(
          data?.detalles.map((detalle: any) => ({
            ...detalle,
            idproducto: detalle.idproducto,
            productoNombre: detalle.producto,
            cantidad: detalle.cantidadpedida,
          })),
        );
        setProveedor(data?.idproveedor);
      },
    },
  );

  const { data } = useQuery(['getNotaPedidoPDF'], () => getNotaPedidoPDF(parseInt(id as string)), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    enabled: isImprimirPDF,
    onSuccess: (data) => {
      const props: any = {
        outputType: OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: `ColorCor NP00${data.id}-V00${data.version}`,
        orientationLandscape: false,
        compress: true,
        logo: {
          src: 'https://i.ibb.co/6r9YkfP/logo.png',
          width: 25, //aspect ratio = width/height
          height: 25,
          margin: {
            top: 0, //negative or positive num, from the current position
            left: 0, //negative or positive num, from the current position
          },
        },
        stamp: {
          inAllPages: true,
          src: '',
          width: 20, //aspect ratio = width/height
          height: 20,
          margin: {
            top: 0, //negative or positive num, from the current position
            left: 0, //negative or positive num, from the current position
          },
        },
        business: {
          name: 'ColorCor S.A.',
          address: 'Zapiola 77',
          phone: '(0351) 155622138',
          email: 'compras@colorcor.com.ar',

          website: 'https://colorcor.netlify.app/',
        },
        contact: {
          label: t('common.notaDePedidoPara'),
          name: data.proveedor.nombre,
          address: data.proveedor.direccion,
          phone: data.proveedor.telefono,
          email: data.proveedor.email,
        },
        invoice: {
          label: t('common.notaDePedidoN'),
          num: `${data.id}.${data.version}`,
          invDate: `${t('common.fechaElaboracion')}${data.fechaLocale}`,
          invGenDate: `${t('common.fechaEntrega')}${data.vencimientoLocale}`,
          headerBorder: false,
          tableBodyBorder: false,
          header: [
            {
              title: '#',
              style: {
                width: 10,
              },
            },
            {
              title: t('common.producto'),
              style: {
                width: 30,
              },
            },
            {
              title: t('common.descripcion'),
              style: {
                width: 70,
              },
            },
            { title: t('common.importeunitario') },
            { title: t('common.cantidad') },
            { title: t('common.importetotal') },
          ],
          table: Array.from(data.detalles, (item: any, index) => [
            index + 1,
            item.producto,
            item.descripcion,
            item.precio.toLocaleString(),
            item.cantidadpedida,
            (parseFloat(item.precio) * parseFloat(item.cantidadpedida)).toLocaleString(),
          ]),
          additionalRows: [
            {
              col1: t('common.subtotal'),
              col2: data.acumGravado.toLocaleString(),
              style: {
                fontSize: 10, //optional, default 12
              },
            },
            {
              col1: t('common.iva'),
              col2: data.acumIVA.toLocaleString(),
              style: {
                fontSize: 10, //optional, default 12
              },
            },
            {
              col1: t('common.importetotal'),
              col2: data.acumTotal.toLocaleString(),
              style: {
                fontSize: 14, //optional, default 12
              },
            },
          ],
        },
        footer: {
          text: t('common.notaPedidoFooter'),
        },
        pageEnable: true,
        pageLabel: 'Page ',
      };
      const pdfObject = new jsPDF(props);
      return pdfObject;
    },
  });

  const { mutate: handleCreate, isLoading } = useMutation(postNotaPedido, {
    onSuccess: (res: any) => {
      notificationController.success({
        message: t('common.successMessage'),
        description: t('notifications.npCreada'),
        duration: 3,
      });
      imprimirPDF(res.id);
      setImprimirPDF(true);
      navigate('/compras/notapedido');
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
      notificationController.success({
        message: t('common.successMessage'),
        description: t('notifications.npActualizada'),
        duration: 3,
      });
      imprimirPDF(res.id);
      setImprimirPDF(true);
      navigate('/compras/notapedido');
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
        plazoentrega: values?.plazoentrega,
        idproveedor: values?.idProveedor,
        idtipocompra: values?.idTipoCompra,
        detalles: detalles.map((d: any) => {
          return {
            idproducto: d.idproducto,
            cantidadPedida: d.cantidad,
            precio: parseFloat(d.precio),
          };
        }),
      };
      handleEdit(np);
    } else {
      const np = {
        idusuario: 6, // TODO: Remover hardcode
        plazoentrega: values?.plazoentrega,
        idproveedor: values?.idProveedor,
        idtipocompra: values?.idTipoCompra,
        detalles: detalles.map((d: any) => {
          return {
            idproducto: d.idproducto,
            cantidadpedida: d.cantidad,
            precio: parseInt(d.precio),
          };
        }),
      };
      handleCreate(np);
    }
  };

  const imprimirPDF = async (id: number) => {
    const data = await getNotaPedidoPDF(id);
    const props: any = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: `ColorCor NP00${data.id}-V00${data.version}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: 'https://i.ibb.co/6r9YkfP/logo.png',
        width: 25, //aspect ratio = width/height
        height: 25,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      stamp: {
        inAllPages: true,
        src: '',
        width: 20, //aspect ratio = width/height
        height: 20,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      business: {
        name: 'ColorCor S.A.',
        address: 'Zapiola 77',
        phone: '(0351) 155622138',
        email: 'compras@colorcor.com.ar',

        website: 'https://colorcor.netlify.app/',
      },
      contact: {
        label: t('common.notaDePedidoPara'),
        name: data.proveedor.nombre,
        address: data.proveedor.direccion,
        phone: data.proveedor.telefono,
        email: data.proveedor.email,
      },
      invoice: {
        label: t('common.notaDePedidoN'),
        num: `${data.id}.${data.version}`,
        invDate: `${t('common.fechaElaboracion')}${data.fechaLocale}`,
        invGenDate: `${t('common.fechaEntrega')}${data.vencimientoLocale}`,
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          {
            title: '#',
            style: {
              width: 10,
            },
          },
          {
            title: t('common.producto'),
            style: {
              width: 30,
            },
          },
          {
            title: t('common.descripcion'),
            style: {
              width: 70,
            },
          },
          { title: t('common.importeunitario') },
          { title: t('common.cantidad') },
          { title: t('common.importetotal') },
        ],
        table: Array.from(data.detalles, (item: any, index) => [
          index + 1,
          item.producto,
          item.descripcion,
          item.precio.toLocaleString(),
          item.cantidadpedida,
          (parseFloat(item.precio) * parseFloat(item.cantidadpedida)).toLocaleString(),
        ]),
        additionalRows: [
          {
            col1: t('common.subtotal'),
            col2: data.acumGravado.toLocaleString(),
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: t('common.iva'),
            col2: data.acumIVA.toLocaleString(),
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: t('common.importetotal'),
            col2: data.acumTotal.toLocaleString(),
            style: {
              fontSize: 14, //optional, default 12
            },
          },
        ],
      },
      footer: {
        text: t('common.notaPedidoFooter'),
      },
      pageEnable: true,
      pageLabel: 'Page ',
    };
    const pdfObj = jsPDFInvoiceTemplate(props);
  };

  // #region Productos

  const columns = [
    {
      title: t('common.nombre'),
      dataIndex: 'productoNombre',
      key: 'productoNombre',

      sorter: (a: any, b: any) => a.productoNombre.localeCompare(b.productoNombre),
    },
    {
      title: t('common.importeunitario'),
      dataIndex: 'precio',
      key: 'precio',
      width: '5%',

      sorter: (a: any, b: any) => a.precio - b.precio,
      render: (text: any, record: any) => {
        return <span>${record.precio}</span>;
      },
    },
    {
      title: t('common.iva'),
      key: 'iva',
      width: '5%',

      sorter: (a: any, b: any) => a.precio - b.precio,
      render: (text: any, record: any) => {
        return <span>${record.precio * 0.21}</span>;
      },
    },
    {
      title: t('common.cantidad'),
      dataIndex: 'cantidad',
      key: 'cantidad',
      width: '5%',

      sorter: (a: any, b: any) => a.cantidad - b.cantidad,
    },
    {
      title: t('common.importetotal'),
      key: 'importetotal',
      width: '5%',

      sorter: (a: any, b: any) => Math.round(a.precio * a.cantidad * 1.21) - Math.round(b.precio * b.cantidad * 1.21),
      render: (text: any, record: any) => {
        return <span>${record.precio * record.cantidad * 1.21}</span>;
      },
    },
    {
      title: t('common.acciones'),
      width: '10%',
      key: 'acciones',
      render: (text: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<DeleteOutlined />}
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
      dataIndex: 'idproducto',
      key: 'idproducto',
      width: '5%',
      sorter: (a: any, b: any) => a.idproducto - b.idproducto,
    },
    {
      title: t('common.nombre'),
      dataIndex: 'productoNombre',
      key: 'productoNombre',
      width: '70%',
      sorter: (a: any, b: any) => a.productoNombre.localeCompare(b.productoNombre),
    },
    {
      title: t('common.importeunitario'),
      dataIndex: 'precio',
      key: 'precio',
      sorter: (a: any, b: any) => a.precio - b.precio,
      render: (text: any, record: any) => {
        return <span>${record.precio}</span>;
      },
    },
    {
      title: t('common.cantidad'),
      dataIndex: 'cantidad',
      key: 'cantidad',
      minWidth: '120px',
      render: (text: any, record: any) => {
        return (
          <InputNumber
            size="small"
            min={0}
            max={record.stock}
            defaultValue={0}
            style={{ width: '120px' }}
            value={(productos as any).find((p: any) => p.idproducto === record.idproducto)?.cantidad}
            onChange={(value) => {
              const newProductos = productos.map((p: any) => {
                if (p.idproducto === record.idproducto) {
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
    const newDetalles = detalles.filter((d: any) => d.idproducto !== record.idproducto);
    setDetalles(newDetalles);
  };

  const filteredProductos = () => {
    const arr = productosDeProveedorData?.filter(
      (p: any) =>
        p.productoNombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
        p.idproducto.toString().toLowerCase().includes(searchProducto.toLowerCase()),
    );

    return arr;
  };

  if (isLoadingNP && isEdit) {
    return <Spin />;
  }

  return (
    <div id="nota-de-pedido-form">
      <PageTitle>{isEdit ? t('titles.editandoNP') : t('titles.creandoNP')}</PageTitle>
      {/* #region Formulario  */}
      <Row>
        {isTablet ? (
          <Col span={24}>
            <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
              <Row justify="space-between">
                <h1 style={{ fontSize: '25px' }}>{isEdit ? t('titles.editandoNP') : t('titles.creandoNP')}</h1>
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
              <p>
                {t('common.fecha') +
                  `: ${
                    form.getFieldValue('fecha')
                      ? new Date(form.getFieldValue('fecha')).toLocaleDateString()
                      : new Date().toLocaleDateString()
                  }`}
              </p>

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
                        productosDeProveedorRefetch();
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
                <Col span={6} offset={1}>
                  <FormItem
                    requiredMark
                    name="plazoentrega"
                    label={t('common.plazoentrega')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <InputNumber min={0} addonAfter="días." style={{ width: '100%' }} />
                  </FormItem>
                </Col>
                <Col offset={3} span={1}>
                  <Tooltip placement="left" title={t('common.agregarProductos')} trigger="hover" destroyTooltipOnHide>
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
                  </Tooltip>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Table
                    size="small"
                    rowKey={(record) => record.id}
                    columns={columns}
                    dataSource={detalles}
                    loading={isEdit && isLoadingNP}
                    pagination={{
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
                </Col>
              </Row>
            </BaseForm>
          </Col>
        ) : (
          <Col span={24}>
            <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
              <Row justify="space-between">
                <h1 style={{ fontSize: '25px' }}>{isEdit ? t('titles.editandoNP') : t('titles.creandoNP')}</h1>
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
              <p>
                {t('common.fecha') +
                  `: ${
                    form.getFieldValue('fecha')
                      ? new Date(form.getFieldValue('fecha')).toLocaleDateString()
                      : new Date().toLocaleDateString()
                  }`}
              </p>

              <Row
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Col span={24}>
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
                        productosDeProveedorRefetch();
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
                <Col span={24}>
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
                <Col span={24}>
                  <FormItem
                    requiredMark
                    name="plazoentrega"
                    label={t('common.plazoentrega')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                  >
                    <InputNumber min={0} addonAfter="días." style={{ width: '100%' }} />
                  </FormItem>
                </Col>
                <Col offset={21} span={3}>
                  <Tooltip placement="left" title={t('common.agregarProductos')} trigger="hover" destroyTooltipOnHide>
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
                  </Tooltip>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Table
                    size="small"
                    rowKey={(record) => record.id}
                    columns={columns}
                    dataSource={detalles}
                    loading={isEdit && isLoadingNP}
                    pagination={{
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
                </Col>
              </Row>
            </BaseForm>
          </Col>
        )}
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
              size="small"
              placeholder={t('table.buscarProducto')}
              value={searchProducto}
              onChange={(e) => setSearchProducto(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Table
          size="small"
          pagination={{
            pageSize: 5,
            pageSizeOptions: ['5', '10', '20'],
            showSizeChanger: true,
            locale: {
              items_per_page: t('common.pagina'),
            },
          }}
          rowKey={(record) => record.id}
          columns={agregarProductosColumnas}
          dataSource={filteredProductos()}
          loading={isLoadingProductosDeProveedor}
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
      </Modal>
    </div>
  );
};
