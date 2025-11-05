import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Tag,
  Space,
  Typography,
  Button,
  Input,
  Card,
  Avatar,
  Spin,
  Tooltip
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import type { UserDTO } from '@chikox/types';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function UsersPage() {
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

  const columns: ColumnsType<UserDTO> = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: UserDTO) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{name || 'N/A'}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'User', value: 'USER' },
        { text: 'Admin', value: 'ADMIN' },
        { text: 'Super Admin', value: 'SUPER_ADMIN' }
      ],
      onFilter: (value, record) => record.role === value,
      render: (role: string) => <Tag color={getRoleColor(role)}>{role}</Tag>
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => (
        <Tooltip title={dayjs(date).format('YYYY-MM-DD HH:mm:ss')}>
          {dayjs(date).format('MMM DD, YYYY')}
        </Tooltip>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} size="small">
            Edit
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <DashboardLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            Users Management
          </Title>
          <Button type="primary" icon={<PlusOutlined />}>
            Add User
          </Button>
        </div>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              size="large"
              style={{ maxWidth: 400 }}
            />

            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={isLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} users`
              }}
            />
          </Space>
        </Card>
      </Space>
    </DashboardLayout>
  );
}
