import React, { useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Badge } from '@app/components/common/Badge/Badge';
import { NotificationsOverlay } from '@app/components/header/components/notificationsDropdown/NotificationsOverlay/NotificationsOverlay';
import { getStockNotifications, Notification } from '@app/api/notifications.api';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { useQuery } from '@tanstack/react-query';

export const NotificationsDropdown: React.FC = () => {
  const { data: fetchedNotifications, isLoading } = useQuery(['notifications'], getStockNotifications, {
    keepPreviousData: false,
    refetchOnWindowFocus: false,
    onSuccess: (data: any) => {
      const mappedNotifications = data?.map((notification: any) => ({
        id: notification.id.toString(),
        description: notification.nombre,
        type: 'stock',
      }));
      setNotifications(mappedNotifications);
    },
  });
  const [notifications, setNotifications] = useState<Notification[]>(fetchedNotifications);
  const [isOpened, setOpened] = useState(false);

  return (
    <Dropdown
      trigger={['click']}
      overlay={<NotificationsOverlay notifications={notifications} setNotifications={setNotifications} />}
      onVisibleChange={setOpened}
    >
      <HeaderActionWrapper>
        <Button
          type={isOpened ? 'ghost' : 'text'}
          icon={
            <Badge dot={notifications?.length > 0}>
              <BellOutlined />
            </Badge>
          }
        />
      </HeaderActionWrapper>
    </Dropdown>
  );
};
