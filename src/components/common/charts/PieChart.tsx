import React from 'react';
import { EChartsOption } from 'echarts-for-react';
import { BaseChart, BaseChartProps } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { BASE_COLORS } from '@app/styles/themes/constants';

interface PieChartProps extends BaseChartProps {
  option?: EChartsOption;
  // eslint-disable-next-line
  data?: any;
  name?: string;
  showLegend?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({ option, data, name, showLegend, ...props }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const defaultPieOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: showLegend,
      top: '0%',
      left: 16,
      textStyle: {
        color: themeObject[theme].textMain,
      },
    },
    series: [
      {
        name,
        type: 'pie',
        center: ['50%', '50%'],
        radius: '55%',
        label: {
          color: 'var(--text-main-color)',
        },
        labelLine: {
          lineStyle: {
            color: 'var(--text-main-color)',
          },
          smooth: 0.2,
          length: 10,
          length2: 20,
        },
        data,
        itemStyle: {
          borderRadius: 5,
          borderColor: theme === 'dark' ? BASE_COLORS.black : BASE_COLORS.white,
          borderWidth: 1,
          shadowBlur: 1000,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (idx: any) => {
          return Math.random() * 200;
        },
      },
    ],
  };
  return <BaseChart {...props} option={{ ...defaultPieOption, ...option }} />;
};
