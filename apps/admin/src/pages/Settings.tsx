import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Switch, Typography, Space, Divider, Spin } from 'antd';
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
      >
        <Spin size="large" />
      </div>
    );
  }

  const onFinish = (values: any) => {
    console.log('Settings updated:', values);
  };

  return (
    <DashboardLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Settings</Title>

        <Card title="General Settings" bordered={false}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Site Name" name="siteName" initialValue="Chikox">
              <Input />
            </Form.Item>

            <Form.Item
              label="Site Description"
              name="siteDescription"
              initialValue="Full-stack TypeScript application"
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Divider />

            <Title level={4}>Notifications</Title>

            <Form.Item
              label="Email Notifications"
              name="emailNotifications"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Push Notifications"
              name="pushNotifications"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>

            <Divider />

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Security" bordered={false}>
          <Paragraph type="secondary">
            Configure security settings for your application.
          </Paragraph>
          <Button>Change Password</Button>
        </Card>
      </Space>
    </DashboardLayout>
  );
}
