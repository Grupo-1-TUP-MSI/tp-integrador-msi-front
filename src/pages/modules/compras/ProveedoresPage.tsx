import React, { useEffect } from 'react';
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Space, Spin, Table, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Proveedor, TiposIVA, TiposDocumento } from '@app/models/models';
import { useNavigate, useParams } from 'react-router';
import { notificationController } from '@app/controllers/notificationController';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import FormItem from 'antd/es/form/FormItem';
import { FormInput, SubmitButton } from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import {
  getProveedores,
  getProveedor,
  postProveedor,
  putProveedor,
  deleteProveedor,
} from '../../../api/proveedores.api';
import { useResponsive } from '@app/hooks/useResponsive';
import { BotonCSV } from '@app/components/shared/BotonCSV';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

export const ProveedoresPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchProveedor, setSearchProveedor] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [filterEstado, setFilterEstado] = React.useState(true);
  const [proveedor, setProveedor] = React.useState<Proveedor | null>(null);
  const [filterTipoIVA, setFilterTipoIVA] = React.useState(null);
  const {
    data: proveedoresData,
    isLoading: isLoadingProveedores,
    refetch: refetchProveedores,
    isRefetching: isRefetchingProveedores,
  } = useQuery(['proveedores'], getProveedores, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: eliminarProveedor, isLoading: isLoadingDelete } = useMutation(deleteProveedor, {
    onSuccess: (res) => {
      if (res !== 400) {
        notificationController.success({
          message: t('common.successMessage'),
          description: t('notifications.proveedorEliminado'),
          duration: 3,
        });
        setIsModalOpen(false);
        refetchProveedores();
      } else {
        throw new Error('Error al eliminar proveedor');
      }
    },
    onError: (error: Error) => {
      notificationController.error({
        message: t('common.errorMessage'),
        description: t('notifications.proveedorNoEliminado'),
        duration: 3,
      });
    },
  });

  const handleDelete = (record: any) => {
    eliminarProveedor(record.id);
  };

  const columns = [
    {
      title: t('common.documento'),
      dataIndex: 'documento',
      key: 'documento',

      sorter: (a: any, b: any) => a.documento - b.documento,
      render: (text: any, record: any) => TiposDocumento[record.idtipodocumento - 1] + ' ' + record.documento,
    },
    {
      title: t('common.nombre'),
      dataIndex: 'nombre',
      key: 'nombre',

      sorter: (a: any, b: any) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: t('common.tipoiva'),
      dataIndex: 'tipoiva',
      key: 'tipoiva',

      sorter: (a: any, b: any) => a.tipoiva - b.tipoiva,
      render: (text: any, record: any) => TiposIVA[record.tipoiva - 1],
    },

    {
      title: t('common.direccion'),
      dataIndex: 'direccion',
      key: 'direccion',

      sorter: (a: any, b: any) => a.direccion.localeCompare(b.direccion),
      render: (text: any, record: any) => record.direccion + ', CP: ' + record.cp,
    },
    {
      title: t('common.telefono'),
      dataIndex: 'telefono',
      key: 'telefono',

      sorter: (a: any, b: any) => a.telefono - b.telefono,
    },
    {
      title: t('common.email'),
      dataIndex: 'email',
      key: 'email',

      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
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
                navigate(`/compras/proveedores/${record.id}`);
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
              setProveedor(record);
            }}
          ></Button>
        </Space>
      ),
    },
  ];

  const proveedoresFiltrados = () => {
    const arr = proveedoresData
      ?.filter((proveedor: Proveedor) => {
        return (
          proveedor.nombre.toLowerCase().includes(searchProveedor.toLowerCase()) ||
          `${TiposDocumento[(proveedor.idtipodocumento as number) - 1]} ${proveedor.documento}`
            .toLowerCase()
            .includes(searchProveedor.toLowerCase())
        );
      })
      .filter((proveedor: Proveedor) => {
        return !!filterEstado ? proveedor.estado === filterEstado : true;
      })
      .filter((proveedor: Proveedor) => {
        return filterTipoIVA ? TiposIVA[proveedor.tipoiva - 1] === filterTipoIVA : true;
      })
      .sort((a: Proveedor, b: Proveedor) => {
        return (a.id as number) - (b.id as number);
      });

    return arr;
  };

  return (
    <>
      <PageTitle>{t('common.proveedores')}</PageTitle>
      <Modal
        title={t('notifications.eliminandoElemento')}
        visible={isModalOpen}
        onOk={() => {
          handleDelete(proveedor);
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
        <h1 style={{ color: 'var(--timeline-background)', fontSize: '25px' }}>{t('common.proveedores')}</h1>

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
              onClick={() => navigate('/compras/proveedores/alta')}
            ></Button>
          </Tooltip>
          <BotonCSV list={proveedoresFiltrados()} fileName={'proveedores'} />
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
          value={searchProveedor}
          onChange={(e) => setSearchProveedor(e.target.value)}
          placeholder={t('table.buscarProveedor')}
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
        dataSource={proveedoresFiltrados()}
        loading={isLoadingProveedores || isRefetchingProveedores}
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

export const ProveedoresForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setIsEdit] = React.useState(false);
  const [form] = Form.useForm();
  const { isTablet } = useResponsive();
  const documentoLength = Form.useWatch('tipoDocumento', form);

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
  const tipoDocumentoLength = () => {
    return (
      TiposDocumento[parseInt(documentoLength) - 1] === 'CUIT' ||
      TiposDocumento[parseInt(documentoLength) - 1] === 'CUIL'
    );
  };

  if (isLoadingProveedor && isEdit) {
    return <Spin />;
  }

  return (
    <div>
      <PageTitle>{isEdit ? t('titles.editandoProveedor') : t('titles.creandoProveedor')}</PageTitle>
      <Row>
        {isTablet ? (
          <Col offset={6} span={12}>
            <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
              <h1 style={{ fontSize: '25px' }}>
                {isEdit ? t('titles.editandoProveedor') : t('titles.creandoProveedor')}
              </h1>
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
                  <FormItem
                    requiredMark
                    name="telefono"
                    label={t('common.telefono')}
                    rules={[
                      {
                        pattern: new RegExp('^[0-9]*$'),
                        message: t('common.invalidPhone'),
                      },
                    ]}
                  >
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
              <h1 style={{ fontSize: '25px' }}>
                {isEdit ? t('titles.editandoProveedor') : t('titles.creandoProveedor')}
              </h1>
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
                  <FormItem
                    requiredMark
                    name="telefono"
                    label={t('common.telefono')}
                    rules={[
                      {
                        pattern: new RegExp('^[0-9]*$'),
                        message: t('common.invalidPhone'),
                      },
                    ]}
                  >
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
