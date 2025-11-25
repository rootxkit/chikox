import { useEffect, useState } from 'react';
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
  Tooltip,
  Modal,
  message
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DashboardLayout from '@/components/DashboardLayout';
import UserModal from '@/components/UserModal';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { usersApi } from '@/lib/api';
import type { UserDTO } from '@chikox/types';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function UsersPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { users, isLoading, mutate } = useUsers();
  const [searchText, setSearchText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!authLoading && isAuthenticated && !isAdmin()) {
      navigate('/login', { replace: true });
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

  const handleOpenModal = (user?: UserDTO) => {
    setEditingUser(user || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        // Update existing user
        await usersApi.update(editingUser.id, values);
        message.success('User updated successfully');
      } else {
        // Create new user
        await usersApi.create(values);
        message.success('User created successfully');
      }
      mutate(); // Refresh the users list
      handleCloseModal();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Failed to save user';
      message.error(errorMessage);
      throw error;
    }
  };

  const handleDelete = (user: UserDTO) => {
    Modal.confirm({
      title: 'Delete User',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${user.name || user.email}?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await usersApi.delete(user.id);
          message.success('User deleted successfully');
          mutate(); // Refresh the users list
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.error?.message || error.message || 'Failed to delete user';
          message.error(errorMessage);
        }
      }
    });
  };

  const handleToggleActivation = async (user: UserDTO) => {
    try {
      await usersApi.toggleActivation(user.id);
      message.success(
        user.emailVerified
          ? 'User marked as unverified successfully'
          : 'User marked as verified successfully'
      );
      await mutate(); // Refresh the users list
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Failed to toggle verification';
      message.error(errorMessage);
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns: ColumnsType<UserDTO> = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: UserDTO) => (
        <Space data-testid={`user-${record.id}`}>
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
      render: (role: string) => (
        <Tag color={getRoleColor(role)} data-testid="role-tag">
          {role}
        </Tag>
      )
    },
    {
      title: 'Email Verified',
      dataIndex: 'emailVerified',
      key: 'emailVerified',
      filters: [
        { text: 'Verified', value: true },
        { text: 'Not Verified', value: false }
      ],
      onFilter: (value, record) => record.emailVerified === value,
      render: (emailVerified: boolean) => (
        <Tag color={emailVerified ? 'success' : 'warning'} data-testid="status-tag">
          {emailVerified ? 'Verified' : 'Not Verified'}
        </Tag>
      )
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
      render: (_, record: UserDTO) => (
        <Space size="middle">
          <Tooltip title={record.emailVerified ? 'Mark as unverified' : 'Mark as verified'}>
            <Button
              type="link"
              size="small"
              onClick={() => handleToggleActivation(record)}
              data-testid="toggle-activation-button"
            >
              {record.emailVerified ? 'Unverify' : 'Verify'}
            </Button>
          </Tooltip>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenModal(record)}
            data-testid="edit-button"
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            data-testid="delete-button"
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <DashboardLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }} data-testid="users-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            Users Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            data-testid="add-user-button"
          >
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              data-testid="search-input"
            />

            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="id"
              loading={isLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} users`
              }}
              data-testid="users-table"
            />
          </Space>
        </Card>
      </Space>

      <UserModal
        open={modalOpen}
        editingUser={editingUser}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
}
