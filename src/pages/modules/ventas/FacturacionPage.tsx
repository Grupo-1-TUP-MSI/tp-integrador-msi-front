import React from 'react';
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
  Tooltip,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Proveedor, TipoVenta, Usuario } from '@app/models/models';
import { useNavigate, useParams } from 'react-router';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import FormItem from 'antd/es/form/FormItem';
import { SubmitButton } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { Table } from '@app/components/common/Table/Table';
import { getFacturas, getFacturaPDF, postFactura } from '@app/api/facturas.api';
import { getUsuarios } from '@app/api/usuarios.api';
import locale from 'antd/es/date-picker/locale/es_ES';
import { getProductosDeProveedor } from '@app/api/productos.api';
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from 'jspdf-invoice-template';
import { getClientes } from '@app/api/clientes.api';

export const FacturacionPage: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [filterUsuario, setFilterUsuario] = React.useState(null);
  const [filterCliente, setFilterCliente] = React.useState(null);
  const [filterTipoVenta, setFilterTipoVenta] = React.useState<number | null>(null);
  const [filterDates, setFilterDates] = React.useState<any>([]);

  const { data: facturasData, isLoading: isLoadingFacturas } = useQuery(['facturas'], getFacturas, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });
  const { data: usuariosData, isLoading: isLoadingUsuarios } = useQuery(['usuarios'], getUsuarios, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });
  const { data: clientesData, isLoading: isLoadingClientes } = useQuery(['clientes'], getClientes, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      title: t('common.numero'),
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: any) => {
        return <span>{record.id}</span>;
      },
    },
    {
      title: t('common.fecha'),
      dataIndex: 'fecha',
      key: 'fecha',
      render: (text: any, record: any) => {
        return <span>{new Date(record.fecha).toLocaleDateString('es')}</span>;
      },
    },
    {
      title: t('common.usuario'),
      dataIndex: 'usuario',
      key: 'usuario',
    },
    {
      title: t('common.cliente'),
      dataIndex: 'cliente',
      key: 'cliente',
    },
    {
      title: t('common.tipoventa'),
      dataIndex: 'idTipoVenta',
      key: 'idTipoVenta',
      render: (text: any, record: any) => TipoVenta[record.idTipoVenta - 1],
    },
    {
      title: t('common.acciones'),
      width: '10%',
      key: 'acciones',
      render: (text: any, record: any) => (
        <Space>
          <Tooltip placement="top" title={t('common.exportarPDF')} trigger="hover" destroyTooltipOnHide>
            <Button
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
      },
      {
        title: t('common.importeunitario'),
        dataIndex: 'precio',
        key: 'precio',
        width: '10%',
        render: (text: any, record: any) => {
          return <span>ARS ${record.precio}</span>;
        },
      },
      {
        title: t('common.iva'),
        key: 'iva',
        width: '10%',
        render: (text: any, record: any) => {
          return <span>ARS ${Math.round(record.precio * 0.21)}</span>;
        },
      },
      {
        title: t('common.cantidad'),
        dataIndex: 'cantidad',
        key: 'cantidad',
        width: '10%',
      },
      {
        title: t('common.importetotal'),
        key: 'importetotal',
        width: '10%',

        render: (text: any, record: any) => {
          return <span>ARS ${Math.round(record.precio * record.cantidad * 1.21)}</span>;
        },
      },
    ];

    const data = notaPedido?.detalles;

    return (
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data}
        pagination={false}
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
    );
  };

  const imprimirPDF = async (id: number) => {
    const data = await getFacturaPDF(id);
    const props: any = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: `ColorCor F00${data.id}-V00${data.version}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: 'https://i.postimg.cc/3w2KmPdm/logo.png',
        width: 25, //aspect ratio = width/height
        height: 25,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      stamp: {
        inAllPages: true,
        src: 'https://i.postimg.cc/YCCvCcKC/qr-code.jpg',
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
        label: 'Nota de Pedido para:',
        name: data.proveedor.nombre,
        address: data.proveedor.direccion,
        phone: data.proveedor.telefono,
        email: data.proveedor.email,
      },
      invoice: {
        label: 'Nota de Pedido#: ',
        num: `${data.id} Version: ${data.version}`,
        invDate: `Fecha de elaboracion: ${data.fechaLocale}`,
        invGenDate: `Fecha de entrega: ${data.vencimientoLocale}`,
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
            title: 'Producto',
            style: {
              width: 30,
            },
          },
          {
            title: 'Descripcion',
            style: {
              width: 70,
            },
          },
          { title: 'Precio Unitario' },
          { title: 'Cantidad' },
          { title: 'Total' },
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
            col1: 'Gravado:',
            col2: data.acumGravado.toLocaleString(),
            col3: 'ALL',
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: 'IVA:',
            col2: data.acumIVA.toLocaleString(),
            col3: '%',
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: 'Total:',
            col2: data.acumTotal.toLocaleString(),
            col3: 'ALL',
            style: {
              fontSize: 14, //optional, default 12
            },
          },
        ],
      },
      footer: {
        text: 'Esta nota de pedido se ha creado via web y es un documento valido.',
      },
      pageEnable: true,
      pageLabel: 'Page ',
    };
    const pdfObj = jsPDFInvoiceTemplate(props);
  };

  const facturasFiltradas = () => {
    const arr = facturasData
      ?.filter((factura: any) => {
        if (filterDates?.length > 0) {
          const fecha = new Date(factura.fecha);
          const fechaDesde = new Date(filterDates[0]?.format());
          const fechaHasta = new Date(filterDates[1]?.format());
          return fecha >= fechaDesde && fecha <= fechaHasta;
        }
        return true;
      })
      .filter((factura: any) => {
        if (filterUsuario) {
          return factura?.idUsuario === filterUsuario;
        }
        return true;
      })
      .filter((factura: any) => {
        if (filterCliente) {
          return factura?.idcliente === filterCliente;
        }
        return true;
      })
      .filter((factura: any) => {
        if (filterTipoVenta) {
          return factura?.idTipoVenta === filterTipoVenta;
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h1 style={{ color: 'var(--timeline-background)' }}>{t('common.facturacion')}</h1>

        <Button
          style={{
            color: 'var(--success-color)',
            borderRadius: '2rem',
          }}
          className="success-button"
          icon={<PlusOutlined />}
          type="text"
          onClick={() => navigate('/ventas/facturacion/alta')}
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
        <div
          style={{
            width: '100%',
            marginLeft: '1rem',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Typography.Text style={{ width: '20%', textAlign: 'right' }}>{t('table.filtrarFecha')}:</Typography.Text>
          <RangePicker
            allowClear
            style={{ width: '75%', marginLeft: '1rem' }}
            format="DD/MM/YYYY"
            locale={locale}
            value={filterDates}
            onChange={(value) => {
              setFilterDates(value);
            }}
          />
        </div>
        <Select
          value={filterTipoVenta}
          onChange={(value) => setFilterTipoVenta(value)}
          style={{ width: '100%', marginLeft: '1rem' }}
          placeholder={t('table.filtrarTiposVenta')}
          allowClear
        >
          {TipoVenta.map((estado, i: number) => (
            <Select.Option key={i} value={i + 1}>
              {t(`common.${TipoVenta[i]}`)}
            </Select.Option>
          ))}
        </Select>
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
          value={filterCliente}
          onChange={(value) => setFilterCliente(value)}
          style={{ width: '100%', marginLeft: '1rem' }}
          placeholder={t('table.filtrarClientes')}
          allowClear
        >
          {clientesData?.map((proveedor: Proveedor, i: number) => (
            <Select.Option key={i} value={proveedor?.id}>
              {proveedor?.nombre}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Table
        rowKey={(record) => record.id}
        expandable={{ expandedRowRender }}
        columns={columns}
        dataSource={facturasFiltradas()}
        loading={isLoadingFacturas || isLoadingClientes || isLoadingUsuarios}
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

export const FacturacionForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = React.useState(false);
  const [detalles, setDetalles] = React.useState([]);
  const [productos, setProductos] = React.useState([]);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [searchProducto, setSearchProducto] = React.useState('');
  const [proveedor, setProveedor] = React.useState(null);
  const enabledField = Form.useWatch('idProveedor', form);
  const [isImprimirPDF, setImprimirPDF] = React.useState(false);

  const { data: clientesData, isLoading: isLoadingClientes } = useQuery(['proveedores'], getClientes, {
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
    enabled: !!enabledField,
    onSuccess: (data) => {
      setProductos(data);
      if (!isEdit) {
        setDetalles([]);
      }
    },
  });

  const { data } = useQuery(['getFacturaPDF'], () => getFacturaPDF(parseInt(id as string)), {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    enabled: isImprimirPDF,
    onSuccess: (data) => {
      const props = {
        outputType: OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: 'Invoice 2022',
        orientationLandscape: false,
        compress: true,
        logo: {
          src: 'https://i.postimg.cc/3w2KmPdm/logo.png',
          width: 25, //aspect ratio = width/height
          height: 25,
          margin: {
            top: 0, //negative or positive num, from the current position
            left: 0, //negative or positive num, from the current position
          },
        },
        stamp: {
          inAllPages: true,
          src: 'https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg',
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
          label: 'Nota de Pedido para:',
          name: 'Pintureria ALBA',
          address: 'Dean Funes 1522',
          phone: '(+011) 155 422 222',
          email: 'ventas@alba.com.ar',
          otherInfo: 'www.alba.com.ar',
        },
        invoice: {
          label: 'Nota de Pedido#: ',
          num: 320,
          invDate: 'Fecha de elaboracion: 01/01/2022 18:12',
          invGenDate: 'Fecha de vencimiento: 02/02/2022 10:17',
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
              title: 'Producto',
              style: {
                width: 30,
              },
            },
            {
              title: 'Descripcion',
              style: {
                width: 70,
              },
            },
            { title: 'Precio Unitario' },
            { title: 'Cantidad' },
            { title: 'Total' },
          ],
          table: Array.from(Array(2), (item, index) => [
            index + 1,
            'Pintura Exterior ',
            'Interior / Exterior 20lt Gama Alta ',
            200.5,
            2,
            401,
          ]),
          additionalRows: [
            {
              col1: 'Total:',
              col2: '6015',
              col3: 'ALL',
              style: {
                fontSize: 14, //optional, default 12
              },
            },
            {
              col1: 'IVA:',
              col2: '21',
              col3: '%',
              style: {
                fontSize: 10, //optional, default 12
              },
            },
            {
              col1: 'SubTotal:',
              col2: '4.751,85',
              col3: 'ALL',
              style: {
                fontSize: 10, //optional, default 12
              },
            },
          ],

          invDescLabel: 'Invoice Note',
          invDesc:
            "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
        },
        footer: {
          text: 'Esta nota de pedido se ha creado via web y es un documento valido.',
        },
        pageEnable: true,
        pageLabel: 'Page ',
      };
      const pdfObject = new jsPDF(props);
      return pdfObject;
    },
  });

  const { mutate: handleCreate, isLoading } = useMutation(postFactura, {
    onSuccess: (res: any) => {
      notificationController.success({
        message: t('common.successMessage'),
        description: t('notifications.facturaCreada'),
        duration: 3,
      });
      imprimirPDF(res.id);
      setImprimirPDF(true);
      navigate('/ventas/facturacion');
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.facturaNoCreada'),
        duration: 3,
      });
    },
  });

  const handleSubmit = (values: any) => {
    const np = {
      idusuario: 6, // TODO: Remover hardcode
      plazoentrega: values?.plazoentrega,
      idcliente: values?.idProveedor,
      idtipoventa: values?.idTipoVenta,
      detalles: detalles.map((d: any) => {
        return {
          idproducto: d.idproducto,
          cantidadpedida: d.cantidad,
          precio: parseInt(d.precio),
        };
      }),
    };
    handleCreate(np);
  };

  const imprimirPDF = async (id: number) => {
    const data = await getFacturaPDF(id);
    const props: any = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: `ColorCor F00${data.id}-V00${data.version}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: 'https://i.postimg.cc/3w2KmPdm/logo.png',
        width: 25, //aspect ratio = width/height
        height: 25,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      stamp: {
        inAllPages: true,
        src: 'https://i.postimg.cc/YCCvCcKC/qr-code.jpg',
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
        label: 'Nota de Pedido para:',
        name: data.proveedor.nombre,
        address: data.proveedor.direccion,
        phone: data.proveedor.telefono,
        email: data.proveedor.email,
      },
      invoice: {
        label: 'Nota de Pedido#: ',
        num: `${data.id} Version: ${data.version}`,
        invDate: `Fecha de elaboracion: ${data.fechaLocale}`,
        invGenDate: `Fecha de entrega: ${data.vencimientoLocale}`,
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
            title: 'Producto',
            style: {
              width: 30,
            },
          },
          {
            title: 'Descripcion',
            style: {
              width: 70,
            },
          },
          { title: 'Precio Unitario' },
          { title: 'Cantidad' },
          { title: 'Total' },
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
            col1: 'Gravado:',
            col2: data.acumGravado.toLocaleString(),
            col3: 'ALL',
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: 'IVA:',
            col2: data.acumIVA.toLocaleString(),
            col3: '%',
            style: {
              fontSize: 10, //optional, default 12
            },
          },
          {
            col1: 'Total:',
            col2: data.acumTotal.toLocaleString(),
            col3: 'ALL',
            style: {
              fontSize: 14, //optional, default 12
            },
          },
        ],
      },
      footer: {
        text: 'Esta nota de pedido se ha creado via web y es un documento valido.',
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
    },
    {
      title: t('common.importeunitario'),
      dataIndex: 'precio',
      key: 'precio',
      width: '5%',
    },
    {
      title: t('common.iva'),
      key: 'iva',
      width: '5%',
      render: (text: any, record: any) => {
        return <span>{record.precio * 0.21}</span>;
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
        return <span>{record.precio * record.cantidad * 1.21}</span>;
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
    },
    {
      title: t('common.nombre'),
      dataIndex: 'productoNombre',
      key: 'productoNombre',
    },
    {
      title: t('common.importeunitario'),
      dataIndex: 'precio',
      key: 'precio',
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

  return (
    <div id="nota-de-pedido-form">
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
                  loading={isLoading}
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
                    {clientesData?.map((proveedor: Proveedor, i: number) => (
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
                  name="idTipoVenta"
                  label={t('common.tipocompra')}
                  rules={[{ required: true, message: t('common.requiredField') }]}
                >
                  <Select allowClear>
                    {TipoVenta.map((tc, i) => (
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
                  <InputNumber addonAfter="días." style={{ width: '100%' }} />
                </FormItem>
              </Col>
              <Col offset={3} span={1}>
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
                  columns={columns}
                  dataSource={detalles}
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
          columns={agregarProductosColumnas}
          dataSource={filteredProductos()}
          loading={isLoadingProductosDeProveedor}
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
