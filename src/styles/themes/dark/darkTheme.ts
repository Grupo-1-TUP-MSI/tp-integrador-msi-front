import { shadeColor } from '@app/utils/utils';
import { graphic } from 'echarts';
import { BASE_COLORS } from '../constants';
import { ITheme } from '../types';

const chartColors = {
  chartTooltipLabel: '#6a7985',
  chartColor1: '#0080dd',
  chartColor1Tint: '#0080dd', // update
  chartColor2: '#783EA4',
  chartColor2Tint: '#783EA4', // update
  chartColor3: '#FFB765',
  chartColor3Tint: '#FFB765', // update
  chartColor4: '#79fcc4',
  chartColor4Tint: '#79fcc4', // update
  chartColor5: '#FF5252',
  chartColor5Tint: '#FF5252', // update
  chartPrimaryGradient: new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: 'rgba(51, 156, 253, 0.35)',
    },
    {
      offset: 1,
      color: 'rgba(51, 156, 253, 0)',
    },
  ]),
  chartSecondaryGradient: new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: 'rgba(255, 82, 82, 0.35)',
    },
    {
      offset: 1,
      color: 'rgba(255, 82, 82, 0)',
    },
  ]),
  chartSecondaryGradientSpecular: new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: 'rgba(255, 255, 255, 0)',
    },
    {
      offset: 1,
      color: 'rgba(255, 82, 82, 0.5)',
    },
  ]),
};

export const darkColorsTheme: ITheme = {
  primary: '#0080dd',
  primary1: '#7568f6',
  primaryGradient: 'linear-gradient(211.49deg, #0080dd 15.89%, #0080dd 48.97%)',
  light: '#f5f5f5',
  secondary: '#0072DD',
  error: '#FF5252',
  warning: '#FFB765',
  success: '#57D682',
  background: '#1B2025',
  secondaryBackground: '#1A1E22',
  secondaryBackgroundSelected: shadeColor('#1A1E22', -5),
  additionalBackground: '#1a1e22',
  collapseBackground: '#1a1e22',
  timelineBackground: '#f5f5f5',
  siderBackground: '#1B2025',
  spinnerBase: '#0080dd',
  scroll: '#ddd',
  border: '#ffffff',
  borderNft: '#ddd',
  textMain: '#ffffff',
  textLight: '#fff',
  textSuperLight: '#444',
  textSecondary: '#ffffff',
  textDark: '#404040',
  textNftLight: '#ddd',
  textSiderPrimary: '#0080dd',
  textSiderSecondary: '#ddd',
  subText: '#a9a9a9',
  shadow: 'rgba(0, 0, 0, 0.2)',
  boxShadow: 'none',
  boxShadowHover: 'none',
  boxShadowNft: '0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
  boxShadowNftSecondary:
    '0px 10px 20px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
  dashboardMapBackground: '#0080dd',
  dashboardMapCircleColor: '#ACAEC1',
  dashboardMapControlDisabledBackground: '#7e7e7e',
  notificationSuccess: '#EFFFF4',
  notificationPrimary: '#D7EBFF',
  notificationWarning: '#FFF4E7',
  notificationError: '#FFE2E2',
  heading: BASE_COLORS.white,
  borderBase: '#a9a9a9',
  disable: '#7e7e7e',
  disabledBg: '#1A1E2244',
  layoutBodyBg: '#1B2025',
  layoutHeaderBg: '#1A1E2288',
  layoutSiderBg: '#1a1e22',
  inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
  itemHoverBg: '#1A1E2244',
  backgroundColorBase: '#1A1E2244',
  avatarBg: '#1A1E2244',
  alertTextColor: '#fff',
  breadcrumb: 'rgba(0, 0, 0, 0.45)',
  icon: '#a9a9a9',
  iconHover: '#ffffff',
  ...chartColors,
};

export const antDarkColorsTheme = {
  successBg: '#e6fff2',
  successBorder: '#79fcc4',
};
