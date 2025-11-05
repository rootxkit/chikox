import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Title, Paragraph } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
      data-testid="login-page"
    >
      <Card style={{ width: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Chikox Admin
            </Title>
            <Paragraph type="secondary">Sign in to access the admin dashboard</Paragraph>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            data-testid="login-form"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                data-testid="email-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                data-testid="password-input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                data-testid="login-button"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
