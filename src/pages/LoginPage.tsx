import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@app/components/auth/LoginForm';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('login.login')}</PageTitle>
      <LoginForm />
    </>
  );
};

export default LoginPage;
