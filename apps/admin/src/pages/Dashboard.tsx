import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Typography, Space, Button, Spin } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  RiseOutlined,
  SettingOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading: authLoading, logout } = useAuth();
  const { users, isLoading } = useUsers();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!authLoading && isAuthenticated && !isAdmin()) {
      logout();
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  if (authLoading || !isAuthenticated) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        data-testid="loading-spinner"
      >
        <Spin size="large" />
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const activeUsers = users?.length || 0;
  const adminUsers =
    users?.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length || 0;
  const growthRate = 12.5;

  return (
    <DashboardLayout>
      <Space
        direction="vertical"
        size="large"
        style={{ width: '100%' }}
        data-testid="dashboard-page"
      >
        <Title level={2}>Dashboard</Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card data-testid="total-users-card">
              <Statistic
                title="Total Users"
                value={totalUsers}
                prefix={<UserOutlined />}
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card data-testid="active-users-card">
              <Statistic
                title="Active Users"
                value={activeUsers}
                prefix={<TeamOutlined />}
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card data-testid="admin-users-card">
              <Statistic
                title="Admin Users"
                value={adminUsers}
                prefix={<CrownOutlined />}
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card data-testid="growth-rate-card">
              <Statistic
                title="Growth Rate"
                value={growthRate}
                prefix={<RiseOutlined />}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Recent Activity" data-testid="recent-activity-card">
              <Paragraph type="secondary">No recent activity to display.</Paragraph>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Quick Actions" data-testid="quick-actions-card">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  block
                  onClick={() => navigate('/dashboard/users')}
                  data-testid="manage-users-button"
                >
                  Manage Users
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  block
                  onClick={() => navigate('/dashboard/settings')}
                  data-testid="settings-button"
                >
                  Settings
                </Button>
                <Button icon={<FileTextOutlined />} block data-testid="reports-button">
                  View Reports
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </DashboardLayout>
  );
}
