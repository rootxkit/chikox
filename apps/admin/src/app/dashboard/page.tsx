'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Statistic, Typography, Space, Spin } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  RiseOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';

const { Title } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { users, isLoading: usersLoading } = useUsers();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!authLoading && !isAdmin()) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

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
  const activeUsers = users?.filter((u) => u.role === 'USER').length || 0;
  const adminUsers = users?.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length || 0;

  return (
    <DashboardLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Dashboard</Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={usersLoading}>
              <Statistic
                title="Total Users"
                value={totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card loading={usersLoading}>
              <Statistic
                title="Active Users"
                value={activeUsers}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card loading={usersLoading}>
              <Statistic
                title="Admins"
                value={adminUsers}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Growth Rate"
                value={12.5}
                precision={1}
                valueStyle={{ color: '#3f8600' }}
                prefix={<RiseOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Recent Activity" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Paragraph>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  System is running smoothly
                </Typography.Paragraph>
                <Typography.Paragraph type="secondary">
                  Last updated: {new Date().toLocaleString()}
                </Typography.Paragraph>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Quick Actions" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Link onClick={() => router.push('/dashboard/users')}>
                  Manage Users
                </Typography.Link>
                <Typography.Link onClick={() => router.push('/dashboard/settings')}>
                  System Settings
                </Typography.Link>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </DashboardLayout>
  );
}
