import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Typography, Space } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: 'Users'
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Products'
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    }
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleDropdownClick = (key: string) => {
    if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/settings');
    } else if (key === 'logout') {
      logout();
    }
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }} data-testid="dashboard-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0
        }}
        data-testid="sidebar"
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold'
          }}
          data-testid="app-logo"
        >
          {collapsed ? 'C' : 'Chikox'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          data-testid="sidebar-menu"
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          data-testid="header"
        >
          <div>
            {collapsed ? (
              <MenuUnfoldOutlined
                style={{ fontSize: 18, cursor: 'pointer' }}
                onClick={() => setCollapsed(false)}
                data-testid="menu-unfold"
              />
            ) : (
              <MenuFoldOutlined
                style={{ fontSize: 18, cursor: 'pointer' }}
                onClick={() => setCollapsed(true)}
                data-testid="menu-fold"
              />
            )}
          </div>

          <Dropdown
            menu={{ items: dropdownItems, onClick: ({ key }) => handleDropdownClick(key) }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Space
              style={{
                cursor: 'pointer',
                padding: '0 12px',
                borderRadius: 8,
                transition: 'background 0.3s'
              }}
              data-testid="user-dropdown"
            >
              <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <div style={{ lineHeight: 1.2 }}>
                <div>
                  <Text strong style={{ fontSize: 14 }}>
                    {user?.name || user?.email}
                  </Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {user?.role?.replace('_', ' ')}
                  </Text>
                </div>
              </div>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 280
          }}
          data-testid="content"
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
