import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Avatar,
  Typography,
  Space,
  Button,
  Form,
  Input,
  message,
  Spin,
  Tag,
  Descriptions,
  Divider
} from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/lib/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        email: user.email
      });
    }
  }, [user, form]);

  if (authLoading || !user) {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'red';
      case 'ADMIN':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const getRoleLabel = (role: string) => {
    return role.replace('_', ' ');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      await usersApi.update(user.id, {
        name: values.name,
        email: values.email
      });

      await refreshUser();
      message.success('Profile updated successfully');
      setEditing(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Failed to update profile';
      message.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({
      name: user.name || '',
      email: user.email
    });
    setEditing(false);
  };

  return (
    <DashboardLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            My Profile
          </Title>
          {!editing && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        <Card>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
            />
            <div>
              <Title level={3} style={{ marginBottom: 8 }}>
                {user.name || 'User'}
              </Title>
              <Tag color={getRoleColor(user.role)} style={{ fontSize: 14 }}>
                {getRoleLabel(user.role)}
              </Tag>
            </div>
          </div>

          <Divider />

          {!editing ? (
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Name">
                <Text strong>{user.name || 'Not set'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Text strong>{user.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Member Since">
                <Text>{dayjs(user.createdAt).format('MMMM DD, YYYY')}</Text>
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Form form={form} layout="vertical" style={{ maxWidth: 600, margin: '0 auto' }}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input size="large" placeholder="Enter your name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input size="large" placeholder="Enter your email" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                  <Button icon={<CloseOutlined />} onClick={handleCancel}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Space>
    </DashboardLayout>
  );
}
