import { ExportOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const BotonCSV = ({ list, fileName }: any) => {
  const { t } = useTranslation();
  const exportToCSV = () => {
    // filter out the properties that are arrays
    const filteredList = list.map((item: any) => {
      console.log(list);
      const filteredItem: any = {};
      Object.keys(item).forEach((key) => {
        if (!Array.isArray(item[key])) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const replacer = (key: any, value: any) => (value === null ? '' : value);
    const header = Object.keys(filteredList[0]);
    let csv = filteredList.map((row: any) =>
      header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
    );
    csv.unshift(header.join(','));
    csv = csv.join('\r');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Tooltip placement="left" title={t('common.exportarCSV')} trigger="hover" destroyTooltipOnHide>
      <Button
        style={{
          color: 'var(--warning-color)',
          borderRadius: '2rem',
        }}
        icon={<ExportOutlined />}
        onClick={() => {
          exportToCSV();
        }}
        type="text"
      ></Button>
    </Tooltip>
  );
};
