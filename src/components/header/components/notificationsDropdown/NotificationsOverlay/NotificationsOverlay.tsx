import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row, Space } from 'antd';
import { Notification } from 'components/common/Notification/Notification';
import { capitalize } from 'utils/utils';
import { Notification as NotificationType } from '@app/api/notifications.api';
import { notificationsSeverities } from 'constants/notificationsSeverities';
import * as S from './NotificationsOverlay.styles';

interface NotificationsOverlayProps {
  notifications: NotificationType[];
  setNotifications: (state: NotificationType[]) => void;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({
  notifications,
  setNotifications,
  ...props
}) => {
  const { t } = useTranslation();

  const noticesList = useMemo(
    () =>
      notifications.map((notification, index) => {
        const type = notificationsSeverities.find((dbSeverity) => dbSeverity.id === notification.id)?.name;

        return (
          <Notification
            key={index}
            type={type || 'warning'}
            title={capitalize(type || 'warning')}
            description={t(notification.description)}
          />
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
            <S.Text>{t('header.notifications.noNotifications')}</S.Text>
          )}
        </Col>
        <Col span={24}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <S.Btn type="ghost" onClick={() => setNotifications([])}>
                {t('header.notifications.readAll')}
              </S.Btn>
            </Col>
          </Row>
        </Col>
      </S.MenuRow>
    </S.NoticesOverlayMenu>
  );
};
