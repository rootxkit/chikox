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
  Image,
  Spin,
  Tooltip,
  Modal,
  message
} from 'antd';
import {
  ShoppingOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DashboardLayout from '@/components/DashboardLayout';
import ProductModal from '@/components/ProductModal';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { productsApi } from '@/lib/api';
import type { ProductDTO } from '@chikox/types';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function ProductsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { products, isLoading, mutate } = useProducts();
  const [searchText, setSearchText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);

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

  const handleOpenModal = (product?: ProductDTO) => {
    setEditingProduct(product || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingProduct) {
        // Update existing product
        await productsApi.update(editingProduct.id, values);
        message.success('Product updated successfully');
      } else {
        // Create new product
        await productsApi.create(values);
        message.success('Product created successfully');
      }
      mutate(); // Refresh the products list
      handleCloseModal();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Failed to save product';
      message.error(errorMessage);
      throw error;
    }
  };

  const handleDelete = (product: ProductDTO) => {
    Modal.confirm({
      title: 'Delete Product',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${product.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await productsApi.delete(product.id);
          message.success('Product deleted successfully');
          mutate(); // Refresh the products list
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.error?.message || error.message || 'Failed to delete product';
          message.error(errorMessage);
        }
      }
    });
  };

  const handleToggleActive = async (product: ProductDTO) => {
    try {
      await productsApi.toggleActive(product.id);
      message.success(`Product ${product.isActive ? 'deactivated' : 'activated'} successfully`);
      mutate();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message || 'Failed to update product status';
      message.error(errorMessage);
    }
  };

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchText.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns: ColumnsType<ProductDTO> = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ProductDTO) => (
        <Space data-testid={`product-${record.id}`}>
          {record.images.length > 0 ? (
            <Image
              src={record.images[0].url}
              alt={record.images[0].alt || name}
              width={50}
              height={50}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAADdJREFUaIHtzjEBAAAAwqD1T20ND6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgbRV9AAGLeT5BAAAAAElFTkSuQmCC"
            />
          ) : (
            <div
              style={{
                width: 50,
                height: 50,
                backgroundColor: '#f0f0f0',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShoppingOutlined style={{ fontSize: 20, color: '#999' }} />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.sku}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => <span style={{ fontWeight: 500 }}>${price.toFixed(2)}</span>
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock: number) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>{stock} in stock</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false }
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean, record: ProductDTO) => (
        <Tag
          color={isActive ? 'green' : 'default'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleActive(record)}
        >
          {isActive ? 'Active' : 'Inactive'}
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
      render: (_, record: ProductDTO) => (
        <Space size="middle">
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
      <Space
        direction="vertical"
        size="large"
        style={{ width: '100%' }}
        data-testid="products-page"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            Products Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            data-testid="add-product-button"
          >
            Add Product
          </Button>
        </div>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              size="large"
              style={{ maxWidth: 400 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              data-testid="search-input"
            />

            <Table
              columns={columns}
              dataSource={filteredProducts}
              rowKey="id"
              loading={isLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} products`
              }}
              data-testid="products-table"
            />
          </Space>
        </Card>
      </Space>

      <ProductModal
        open={modalOpen}
        editingProduct={editingProduct}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
}
