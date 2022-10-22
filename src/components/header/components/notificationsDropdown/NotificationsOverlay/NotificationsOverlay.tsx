import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row, Space } from 'antd';
import { Notification } from 'components/common/Notification/Notification';
import * as S from './NotificationsOverlay.styles';
import { useNavigate } from 'react-router-dom';

interface NotificationsOverlayProps {
  notifications: any;
  setNotifications: (state: any) => void;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({
  notifications,
  setNotifications,
  ...props
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const noticesList = useMemo(
    () =>
      notifications.map((notification: any, index: any) => {
        return (
          <div
            key={index}
            onClick={() =>
              navigate('/productos', { state: { id: notification.id, description: notification.description } })
            }
          >
            <Notification
              type="warning"
              title={t('notifications.alertaStock')}
              description={t(notification.description)}
            />
          </div>
        );
      }),
    [notifications, t],
  );

  return (
    <S.NoticesOverlayMenu mode="inline" {...props}>
      <S.MenuRow gutter={[20, 20]}>
        <Col span={24}>
          {notifications.length > 0 ? (
            <Space direction="vertical" size={10} split={<S.SplitDivider />}>
              {noticesList}
            </Space>
          ) : (
            <S.Text>{t('notifications.noNotifications')}</S.Text>
          )}
        </Col>
        <Col span={24}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <S.Btn type="ghost" onClick={() => setNotifications([])}>
                {t('notifications.readAll')}
              </S.Btn>
            </Col>
          </Row>
        </Col>
      </S.MenuRow>
    </S.NoticesOverlayMenu>
  );
};
