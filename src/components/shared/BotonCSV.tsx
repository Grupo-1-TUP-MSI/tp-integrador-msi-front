import { ExportOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

export const BotonCSV = ({ list, fileName }: any) => {
  const exportToCSV = () => {
    console.log(list);
    const replacer = (key: any, value: any) => (value === null ? '' : value);
    const header = Object.keys(list[0]);
    let csv = list.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv = csv.join('\r \n');
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
  );
};
