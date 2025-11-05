'use client';

import { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import type { LoginRequest } from '@chikox/types';

const { Title } = Typography;

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, loading]);

  const onFinish = async (values: LoginRequest) => {
    const result = await login(values);
    if (!result.success) {
      message.error(result.error || 'Login failed');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Chikox Admin
          </Title>
          <Typography.Text type="secondary">Sign in to your admin account</Typography.Text>
        </div>

        <Form form={form} name="login" onFinish={onFinish} size="large" autoComplete="off">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Admin access only. Unauthorized access is prohibited.
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
