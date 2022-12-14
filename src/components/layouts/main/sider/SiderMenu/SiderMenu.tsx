import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import {
  adminSidebarNavigation,
  compradorSidebarNavigation,
  vendedorSidebarNavigation,
  SidebarNavigationItem,
} from '../sidebarNavigation';
import { Divider, Menu } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { readRole } from '@app/services/localStorage.service';

interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
}

const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const sidebarNavigation =
    readRole() === 'COMPRADOR'
      ? compradorSidebarNavigation
      : readRole() === 'VENDEDOR'
      ? vendedorSidebarNavigation
      : adminSidebarNavigation;

  const sidebarNavFlat = sidebarNavigation.reduce(
    (result: SidebarNavigationItem[], current) =>
      result.concat(current.children && current.children.length > 0 ? current.children : current),
    [],
  );

  const currentMenuItem = sidebarNavFlat.find(({ url }) => url === location.pathname);
  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  const openedSubmenu = sidebarNavigation.find(({ children }) =>
    children?.some(({ url }) => url === location.pathname),
  );
  const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

  return (
    <S.Menu
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      onClick={() => setCollapsed(true)}
    >
      {sidebarNavigation.map((nav) =>
        nav.children && nav.children.length > 0 ? (
          <Menu.SubMenu
            key={nav.key}
            title={t(nav.title)}
            icon={nav.icon}
            onTitleClick={() => setCollapsed(false)}
            popupClassName="d-none"
          >
            {nav.children.map((childNav) => (
              <Menu.Item key={childNav.key} title="">
                <Link to={childNav.url || ''}>{t(childNav.title)}</Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : nav.title == 'common.productos' ? (
          <>
            <Divider key="divider" />
            <Menu.Item key={nav.key} title="" icon={nav.icon}>
              <Link to={nav.url || ''}>{t(nav.title)}</Link>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item key={nav.key} title="" icon={nav.icon}>
            <Link to={nav.url || ''}>{t(nav.title)}</Link>
          </Menu.Item>
        ),
      )}
      <Divider />
      <Menu.Item icon={<RollbackOutlined />}>
        <Link to="/logout">{t('login.logout')}</Link>
      </Menu.Item>
    </S.Menu>
  );
};

export default SiderMenu;
