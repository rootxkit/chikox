import { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import type { UserDTO } from '@chikox/types';

interface UserModalProps {
  open: boolean;
  editingUser: UserDTO | null;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

export default function UserModal({ open, editingUser, onCancel, onSubmit }: UserModalProps) {
  const [form] = Form.useForm();
  const isEditing = !!editingUser;

  useEffect(() => {
    if (open) {
      if (editingUser) {
        form.setFieldsValue({
          email: editingUser.email,
          name: editingUser.name || '',
          role: editingUser.role
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingUser, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error: any) {
      if (error.errorFields) {
        // Validation errors are handled by the form
        return;
      }
      message.error(error.message || 'Failed to save user');
    }
  };

  return (
    <Modal
      open={open}
      title={isEditing ? 'Edit User' : 'Create New User'}
      okText={isEditing ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password placeholder="Min 8 characters" />
          </Form.Item>
        )}

        <Form.Item name="name" label="Name">
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select role' }]}
          initialValue="USER"
        >
          <Select>
            <Select.Option value="USER">User</Select.Option>
            <Select.Option value="ADMIN">Admin</Select.Option>
            <Select.Option value="SUPER_ADMIN">Super Admin</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
