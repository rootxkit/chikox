import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Switch, Typography, Space, Divider, Spin, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

const { Title, Paragraph } = Typography;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [form] = Form.useForm();

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
        data-testid="loading-spinner"
      >
        <Spin size="large" />
      </div>
    );
  }

  const onFinish = (values: any) => {
    console.log('Settings updated:', values);
    message.success('Settings saved successfully!');
  };

  return (
    <DashboardLayout>
      <Space
        direction="vertical"
        size="large"
        style={{ width: '100%' }}
        data-testid="settings-page"
      >
        <Title level={2}>Settings</Title>

        <Card title="General Settings" bordered={false} data-testid="general-settings-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            data-testid="settings-form"
          >
            <Form.Item
              label="Site Name"
              name="siteName"
              initialValue="Chikox"
              rules={[{ required: true, message: 'Please enter site name' }]}
            >
              <Input data-testid="site-name-input" />
            </Form.Item>

            <Form.Item
              label="Site Description"
              name="siteDescription"
              initialValue="Full-stack TypeScript application"
              rules={[{ required: true, message: 'Please enter site description' }]}
            >
              <Input.TextArea rows={3} data-testid="site-description-input" />
            </Form.Item>

            <Divider />

            <Title level={4}>Notifications</Title>

            <Form.Item
              label="Email Notifications"
              name="emailNotifications"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch data-testid="email-notifications-switch" />
            </Form.Item>

            <Form.Item
              label="Push Notifications"
              name="pushNotifications"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch data-testid="push-notifications-switch" />
            </Form.Item>

            <Divider />

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                data-testid="save-button"
              >
                Save Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Security" bordered={false} data-testid="security-card">
          <Paragraph type="secondary">
            Configure security settings for your application.
          </Paragraph>
          <Button data-testid="change-password-button">Change Password</Button>
        </Card>
      </Space>
    </DashboardLayout>
  );
}
