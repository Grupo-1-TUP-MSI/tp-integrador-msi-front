import React from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Card } from '@app/components/common/Card/Card';
import { StepForm } from '@app/components/forms/StepForm/StepForm';

const AdvancedFormsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.advancedForms')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col xs={24} sm={24} xl={14}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Card id="step-form" title={t('forms.stepForm')} padding="1.25rem">
                <StepForm />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default AdvancedFormsPage;
