import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { doLogin } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import logo from 'assets/logo.png';
import logoDark from 'assets/logo-dark.png';
import { readRole } from '@app/services/localStorage.service';

interface LoginFormData {
  usuario: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);
  const img = theme === 'dark' ? logoDark : logo;
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (values: LoginFormData) => {
    setLoading(true);
    dispatch(doLogin(values))
      .then(() => {
        readRole() === 'VENDEDOR'
          ? navigate('/ventas/facturacion')
          : readRole() === 'COMPRADOR'
          ? navigate('/compras/notapedido')
          : navigate('/');
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional">
        <img
          src={img}
          alt="Colorcor"
          width={150}
          height={150}
          style={{ position: 'absolute', left: 0, right: 0, top: -60, marginLeft: 'auto', marginRight: 'auto' }}
        />
        <Auth.FormTitle>{t('login.login')}</Auth.FormTitle>
        <S.LoginDescription>{t('login.loginInfo')}</S.LoginDescription>
        <Auth.FormItem
          name="usuario"
          data-testId="login--usuario"
          label={t('login.email')}
          rules={[
            { required: true, message: t('common.requiredField') },
            {
              type: 'email',
              message: t('common.notValidEmail'),
            },
          ]}
        >
          <Auth.FormInput placeholder={t('login.email')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('login.password')}
          name="password"
          data-testId="login--password"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('login.password')} />
        </Auth.FormItem>

        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading} data-testId="login--loginBtn">
            {t('login.login')}
          </Auth.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
