import React from 'react';
import { Col, Row } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
// import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './uiComponentsPages/DashboardPage.styles';

const DashboardPage: React.FC = () => {
  // const { isDesktop } = useResponsive();

  const desktopLayout = (
    <Row>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
        <Row gutter={[60, 60]}>
          <Col span={24}>Dashboard</Col>
        </Row>
      </S.LeftSideCol>

      <S.RightSideCol xl={8} xxl={7}></S.RightSideCol>
    </Row>
  );

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      {desktopLayout}
    </>
  );
};

export default DashboardPage;
