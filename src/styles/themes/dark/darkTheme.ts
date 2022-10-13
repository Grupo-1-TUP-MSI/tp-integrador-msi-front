import { shadeColor } from '@app/utils/utils';
import { graphic } from 'echarts';
import { BASE_COLORS } from '../constants';
import { ITheme } from '../types';

const chartColors = {
  chartTooltipLabel: '#6a7985',
  chartColor1: '#58A752',
  chartColor1Tint: '#58A752', // update
  chartColor2: '#dc88f5',
  chartColor2Tint: '#dc88f5', // update
  chartColor3: '#FFB765',
  chartColor3Tint: '#FFB765', // update
  chartColor4: '#306955',
  chartColor4Tint: '#306955', // update
  chartColor5: '#ff3d71',
  chartColor5Tint: '#ff3d71', // update
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
  primary: '#58A752',
  primary1: '#7568f6',
  primaryGradient: 'linear-gradient(211.49deg, #dc88f5 15.89%, #58A752 48.97%)',
  light: '#1A1E22',
  secondary: '#0072DD',
  error: '#FF5252',
  warning: '#FFB765',
  success: '#57D682',
  background: '#1b1b1b',
  secondaryBackground: '#1A1E22',
  secondaryBackgroundSelected: shadeColor('#1A1E22', -5),
  additionalBackground: '#1b1b1b',
  collapseBackground: '#1b1b1b',
  timelineBackground: '#f5f5f5',
  siderBackground: '#1A1E22',
  spinnerBase: '#58A752',
  scroll: '#ddd',
  border: '#ffffff',
  borderNft: '#ddd',
  textMain: '#ffffff',
  textLight: '#1A1E2233',
  textSuperLight: '#444',
  textSecondary: '#ffffff',
  textDark: '#404040',
  textNftLight: '#ddd',
  textSiderPrimary: '#58A752',
  textSiderSecondary: '#ddd',
  subText: '#a9a9a9',
  shadow: 'rgba(0, 0, 0, 0.07)',
  boxShadow: 'none',
  boxShadowHover: 'none',
  boxShadowNft: '0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
  boxShadowNftSecondary:
    '0px 10px 20px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
  dashboardMapBackground: '#58A752',
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
  layoutBodyBg: '#1b1b1b',
  layoutHeaderBg: '#1A1E2288',
  layoutSiderBg: '#1A1E22',
  inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
  itemHoverBg: '#1A1E2244',
  backgroundColorBase: '#1A1E2244',
  avatarBg: '#1A1E2244',
  alertTextColor: '#000',
  breadcrumb: '#a9a9a9',
  icon: '#a9a9a9',
  iconHover: '#ffffff',
  ...chartColors,
};

export const antDarkColorsTheme = {
  successBg: '#e6fff2',
  successBorder: '#79fcc4',
};
