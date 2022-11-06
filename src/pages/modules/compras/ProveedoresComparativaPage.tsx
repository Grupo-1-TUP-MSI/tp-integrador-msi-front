import { getProveedores } from '@app/api/proveedores.api';
import { getProductosComparativa } from '@app/api/productos.api';
import { useResponsive } from '@app/hooks/useResponsive';
import { Proveedor } from '@app/models/models';
import { useQuery } from '@tanstack/react-query';
import { Button, Checkbox, Input, InputNumber, Select, Spin, Table, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

export const ProveedoresComparativaPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchProducto, setSearchProducto] = React.useState('');
  const [minPrecio, setMinPrecio] = React.useState(0);
  const [maxPrecio, setMaxPrecio] = React.useState(0);
  const [filterProveedor, setFilterProveedor] = React.useState(null);
  const [searchProveedor, setSearchProveedor] = React.useState('');
  const [filterStock, setFilterStock] = React.useState(false);
  const [productosNota, setProductosNota] = React.useState<any>([]);
  const { isDesktop } = useResponsive();

  const { data: productosData, isLoading: isLoadingProductos } = useQuery(['productos'], getProductosComparativa, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });
  const { data: proveedoresData, isLoading: isLoadingProveedores } = useQuery(['proveedores'], getProveedores, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });

  const productoIsDisabled = (producto: any) => {
    if (productosNota?.length > 0) {
      const proveedorDeProductos = productosNota[0].nombreproveedor;
      return proveedorDeProductos !== producto.nombreproveedor;
    } else {
      return false;
    }
  };

  const columns = [
    {
      title: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{t('common.id')}</span>
          <Tooltip title={t('common.codigoProductoProveedor')} destroyTooltipOnHide>
            <InfoCircleOutlined style={{ opacity: '0.4', marginLeft: '5px' }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'id',
      width: '5%',
      sorter: (a: any, b: any) => a.id.localeCompare(b.id),
    },
    {
      title: t('common.nombre'),
      dataIndex: 'nombre',
      key: 'nombre',

      sorter: (a: any, b: any) => a.nombre.localeCompare(b.nombre),
      render: (text: string, record: any) => (
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
      title: t('common.proveedor'),
      dataIndex: 'nombreproveedor',
      key: 'nombreproveedor',

      sorter: (a: any, b: any) => a.nombreproveedor.localeCompare(b.nombreproveedor),
    },
    {
      title: t('common.precio'),
      dataIndex: 'precio',
      key: 'precio',
      width: '10%',

      sorter: (a: any, b: any) => a.precio - b.precio,
      render: (text: any, record: any) => <span>${record.precio}</span>,
    },
    {
      title: t('common.stock'),
      dataIndex: 'stock',
      key: 'stock',
      width: '10%',

      sorter: (a: any, b: any) => a.stock - b.stock,
    },
  ];

  const productosFiltrados = () => {
    const arr = productosData
      ?.filter((producto: any) => {
        return (
          producto.nombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
          producto.id.toString().includes(searchProducto)
        );
      })
      .filter((producto: any) => {
        return !!filterProveedor ? producto.idproveedor === filterProveedor : true;
      })
      .filter((producto: any) => {
        return !!filterStock ? producto.stock === 0 : true;
      })
      .filter((producto: any) => {
        return !!minPrecio ? producto.precio >= minPrecio : true;
      })
      .filter((producto: any) => {
        return !!maxPrecio ? producto.precio <= maxPrecio : true;
      })
      .sort((a: any, b: any) => {
        return (a.id as number) - (b.id as number);
      });

    return arr;
  };

  const filteredProveedores = () => {
    const arr = proveedoresData
      ?.filter(
        (p: any) =>
          p.nombre.toLowerCase().includes(searchProveedor.toLowerCase()) ||
          p.id.toString().toLowerCase().includes(searchProveedor.toLowerCase()),
      )
      .sort((a: any, b: any) => a.id - b.id);

    return arr;
  };
  if (isLoadingProductos || isLoadingProveedores) {
    return <Spin />;
  }

  return (
    <>
      <PageTitle>{t('common.comparativaProveedores')}</PageTitle>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h1 style={{ color: 'var(--timeline-background)', fontSize: '25px' }}>{t('common.comparativaProveedores')}</h1>
        <Button
          type="primary"
          onClick={() => navigate('/compras/notaPedido/alta', { state: { productos: productosNota } })}
          disabled={productosNota?.length === 0}
        >
          {t('common.comprar')}
        </Button>
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
            <Select
              showSearch
              searchValue={searchProveedor}
              onSearch={(value) => {
                setSearchProveedor(value);
              }}
              filterOption={false}
              value={filterProveedor}
              onChange={(value) => setFilterProveedor(value)}
              style={{ width: '100%', marginLeft: '1rem' }}
              placeholder={t('table.filtrarProveedores')}
              allowClear
            >
              {filteredProveedores()?.map((proveedor: Proveedor, i: number) => (
                <Select.Option key={i} value={proveedor?.id}>
                  {proveedor?.id} - {proveedor?.nombre}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ marginLeft: '1rem', marginRight: '1.2rem' }}>{t('common.precio')}:</div>
            <InputNumber
              min={0}
              placeholder="Min"
              style={{ width: '150px' }}
              value={minPrecio}
              onChange={setMinPrecio}
            />
            <div style={{ marginLeft: '0.8rem', marginRight: '0.8rem' }}>-</div>
            <InputNumber
              min={0}
              placeholder="Max"
              style={{ width: '150px', marginRight: '2rem' }}
              value={maxPrecio}
              onChange={setMaxPrecio}
            />{' '}
            <Checkbox checked={filterStock} onChange={(e) => setFilterStock(e.target.checked)}>
              {t('common.verConStock')}
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
            <Select
              showSearch
              searchValue={searchProveedor}
              onSearch={(value) => {
                setSearchProveedor(value);
              }}
              filterOption={false}
              value={filterProveedor}
              onChange={(value) => setFilterProveedor(value)}
              style={{ width: '100%', marginLeft: '1rem' }}
              placeholder={t('table.filtrarProveedores')}
              allowClear
            >
              {filteredProveedores()?.map((proveedor: Proveedor, i: number) => (
                <Select.Option key={i} value={proveedor?.id}>
                  {proveedor?.id} - {proveedor?.nombre}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ marginLeft: '3rem', marginRight: '1.2rem' }}>{t('common.precio')}:</div>
            <InputNumber placeholder="Min" style={{ width: '150px' }} value={minPrecio} onChange={setMinPrecio} />
            <div style={{ marginLeft: '0.8rem', marginRight: '0.8rem' }}>-</div>
            <InputNumber
              placeholder="Max"
              style={{ width: '150px', marginRight: '2rem' }}
              value={maxPrecio}
              onChange={setMaxPrecio}
            />

            <Checkbox checked={filterStock} onChange={(e) => setFilterStock(e.target.checked)}>
              {t('common.verConStock')}
            </Checkbox>
          </div>
        </div>
      )}
      <Table
        size="small"
        rowKey={(record) => record.id}
        rowClassName={(record) => (productoIsDisabled(record) ? 'disabled-row' : '')}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            setProductosNota(selectedRows);
          },
          hideSelectAll: true,
          columnTitle: <CheckCircleOutlined />,
        }}
        columns={columns}
        dataSource={productosFiltrados()}
        loading={isLoadingProductos}
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
    </>
  );
};
