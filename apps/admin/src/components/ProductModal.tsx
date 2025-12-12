import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, Space, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { ProductDTO } from '@chikox/types';

interface ProductModalProps {
  open: boolean;
  editingProduct: ProductDTO | null;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

export default function ProductModal({
  open,
  editingProduct,
  onCancel,
  onSubmit
}: ProductModalProps) {
  const [form] = Form.useForm();
  const isEditing = !!editingProduct;

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        form.setFieldsValue({
          name: editingProduct.name,
          description: editingProduct.description || '',
          price: editingProduct.price,
          sku: editingProduct.sku,
          stock: editingProduct.stock,
          isActive: editingProduct.isActive,
          images: editingProduct.images.map((img) => ({
            url: img.url,
            alt: img.alt || ''
          }))
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          isActive: true,
          stock: 0,
          images: []
        });
      }
    }
  }, [open, editingProduct, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Filter out empty images
      const images = (values.images || []).filter((img: any) => img?.url?.trim());
      await onSubmit({ ...values, images });
      form.resetFields();
    } catch (error: any) {
      if (error.errorFields) {
        // Validation errors are handled by the form
        return;
      }
      message.error(error.message || 'Failed to save product');
    }
  };

  return (
    <Modal
      open={open}
      title={isEditing ? 'Edit Product' : 'Create New Product'}
      okText={isEditing ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Enter product description" />
        </Form.Item>

        <Space size="large" style={{ width: '100%' }}>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please enter price' },
              { type: 'number', min: 0, message: 'Price must be positive' }
            ]}
            style={{ width: 150 }}
          >
            <InputNumber
              prefix="$"
              precision={2}
              min={0}
              style={{ width: '100%' }}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: 'Please enter SKU' }]}
            style={{ width: 150 }}
          >
            <Input placeholder="SKU-001" disabled={isEditing} />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ type: 'number', min: 0, message: 'Stock must be positive' }]}
            style={{ width: 120 }}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
        </Space>

        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.List name="images">
          {(fields, { add, remove }) => (
            <>
              <div
                style={{
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 500 }}>Product Images</span>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small">
                  Add Image
                </Button>
              </div>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8, width: '100%' }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'url']}
                    rules={[{ required: true, message: 'Image URL is required' }]}
                    style={{ marginBottom: 0, flex: 1, minWidth: 300 }}
                  >
                    <Input placeholder="https://example.com/image.jpg" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'alt']}
                    style={{ marginBottom: 0, width: 150 }}
                  >
                    <Input placeholder="Alt text" />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ color: '#ff4d4f', cursor: 'pointer' }}
                  />
                </Space>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
