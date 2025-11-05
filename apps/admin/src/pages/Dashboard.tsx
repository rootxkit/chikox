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
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { users, isLoading } = useUsers();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    } else if (!authLoading && !isAdmin()) {
      navigate('/login');
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
      >
        <Spin size="large" />
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const activeUsers = users?.length || 0; // All users are considered active for now
  const adminUsers = users?.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length || 0;
  const growthRate = 12.5;

  return (
    <DashboardLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Dashboard</Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={totalUsers}
                prefix={<UserOutlined />}
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={activeUsers}
                prefix={<TeamOutlined />}
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Admin Users"
                value={adminUsers}
                prefix={<CrownOutlined />}
                loading={isLoading}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
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
            <Card title="Recent Activity">
              <Paragraph type="secondary">No recent activity to display.</Paragraph>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Quick Actions">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  block
                  onClick={() => navigate('/dashboard/users')}
                >
                  Manage Users
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  block
                  onClick={() => navigate('/dashboard/settings')}
                >
                  Settings
                </Button>
                <Button icon={<FileTextOutlined />} block>
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
