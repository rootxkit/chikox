import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@chikox/database';
import type {
  ApiResponse,
  ProductDTO,
  ProductImageDTO,
  CreateProductRequest,
  UpdateProductRequest
} from '@chikox/types';
import { authenticate, authorize } from '../utils/auth.js';

// Helper function to map product to DTO
function mapProductToDTO(product: any): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    sku: product.sku,
    stock: product.stock,
    isActive: product.isActive,
    images: (product.images || []).map(
      (img: any): ProductImageDTO => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        order: img.order
      })
    ),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

export async function productRoutes(server: FastifyInstance): Promise<void> {
  /**
   * Get all products (Public)
   */
  server.get<{
    Reply: ApiResponse<ProductDTO[]>;
  }>(
    '/',
    {
      schema: {
        description: 'Get all products',
        tags: ['Products'],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    price: { type: 'number' },
                    sku: { type: 'string' },
                    stock: { type: 'number' },
                    isActive: { type: 'boolean' },
                    images: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          url: { type: 'string' },
                          alt: { type: 'string', nullable: true },
                          order: { type: 'number' }
                        }
                      }
                    },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const products = await prisma.product.findMany({
        include: { images: { orderBy: { order: 'asc' } } },
        orderBy: { createdAt: 'desc' }
      });

      const productsDTO: ProductDTO[] = products.map(mapProductToDTO);

      return reply.send({
        success: true,
        data: productsDTO
      });
    }
  );

  /**
   * Get single product (Public)
   */
  server.get<{
    Params: { id: string };
    Reply: ApiResponse<ProductDTO>;
  }>(
    '/:id',
    {
      schema: {
        description: 'Get a product by ID',
        tags: ['Products'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  price: { type: 'number' },
                  sku: { type: 'string' },
                  stock: { type: 'number' },
                  isActive: { type: 'boolean' },
                  images: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        url: { type: 'string' },
                        alt: { type: 'string', nullable: true },
                        order: { type: 'number' }
                      }
                    }
                  },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const product = await prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: { order: 'asc' } } }
      });

      if (!product) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND'
          }
        });
      }

      return reply.send({
        success: true,
        data: mapProductToDTO(product)
      });
    }
  );

  /**
   * Create product (Admin only)
   */
  server.post<{
    Body: CreateProductRequest;
    Reply: ApiResponse<ProductDTO>;
  }>(
    '/',
    {
      onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')],
      schema: {
        description: 'Create a new product (Admin only)',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['name', 'price', 'sku'],
          properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            price: { type: 'number', minimum: 0 },
            sku: { type: 'string', minLength: 1 },
            stock: { type: 'number', minimum: 0 },
            isActive: { type: 'boolean' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: { type: 'string' },
                  alt: { type: 'string' },
                  order: { type: 'number' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, description, price, sku, stock, isActive, images } =
        request.body as CreateProductRequest;

      // Check if SKU already exists
      const existingProduct = await prisma.product.findUnique({
        where: { sku }
      });

      if (existingProduct) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Product with this SKU already exists',
            code: 'SKU_EXISTS'
          }
        });
      }

      // Create product with images
      const product = await prisma.product.create({
        data: {
          name,
          description: description || null,
          price,
          sku,
          stock: stock ?? 0,
          isActive: isActive ?? true,
          images: images
            ? {
                create: images.map((img, index) => ({
                  url: img.url,
                  alt: img.alt || null,
                  order: img.order ?? index
                }))
              }
            : undefined
        },
        include: { images: { orderBy: { order: 'asc' } } }
      });

      return reply.status(201).send({
        success: true,
        data: mapProductToDTO(product)
      });
    }
  );

  /**
   * Update product (Admin only)
   */
  server.patch<{
    Params: { id: string };
    Body: UpdateProductRequest;
    Reply: ApiResponse<ProductDTO>;
  }>(
    '/:id',
    {
      onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')],
      schema: {
        description: 'Update a product (Admin only)',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            price: { type: 'number', minimum: 0 },
            stock: { type: 'number', minimum: 0 },
            isActive: { type: 'boolean' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: { type: 'string' },
                  alt: { type: 'string' },
                  order: { type: 'number' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const { name, description, price, stock, isActive, images } =
        request.body as UpdateProductRequest;

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND'
          }
        });
      }

      // Update product
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(price !== undefined && { price }),
          ...(stock !== undefined && { stock }),
          ...(isActive !== undefined && { isActive }),
          // If images are provided, delete old ones and create new ones
          ...(images !== undefined && {
            images: {
              deleteMany: {},
              create: images.map((img, index) => ({
                url: img.url,
                alt: img.alt || null,
                order: img.order ?? index
              }))
            }
          })
        },
        include: { images: { orderBy: { order: 'asc' } } }
      });

      return reply.send({
        success: true,
        data: mapProductToDTO(product)
      });
    }
  );

  /**
   * Delete product (Admin only)
   */
  server.delete<{
    Params: { id: string };
    Reply: ApiResponse<{ id: string }>;
  }>(
    '/:id',
    {
      onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')],
      schema: {
        description: 'Delete a product (Admin only)',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND'
          }
        });
      }

      // Delete product (images cascade delete automatically)
      await prisma.product.delete({
        where: { id }
      });

      return reply.send({
        success: true,
        data: { id }
      });
    }
  );

  /**
   * Toggle product active status (Admin only)
   */
  server.patch<{
    Params: { id: string };
    Reply: ApiResponse<ProductDTO>;
  }>(
    '/:id/toggle-active',
    {
      onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')],
      schema: {
        description: 'Toggle product active status (Admin only)',
        tags: ['Products'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      // Get product
      const product = await prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND'
          }
        });
      }

      // Toggle isActive status
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          isActive: !product.isActive
        },
        include: { images: { orderBy: { order: 'asc' } } }
      });

      return reply.send({
        success: true,
        data: mapProductToDTO(updatedProduct)
      });
    }
  );
}
