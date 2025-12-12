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

// Helper function to generate URL-friendly slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

// Helper function to ensure slug is unique by appending a suffix if needed
async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Helper function to map product to DTO
function mapProductToDTO(product: any): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
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
   * Get single product by slug or ID (Public)
   */
  server.get<{
    Params: { slugOrId: string };
    Reply: ApiResponse<ProductDTO>;
  }>(
    '/:slugOrId',
    {
      schema: {
        description: 'Get a product by slug (SEO-friendly) or ID',
        tags: ['Products'],
        params: {
          type: 'object',
          properties: {
            slugOrId: { type: 'string' }
          },
          required: ['slugOrId']
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
                  slug: { type: 'string' },
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
      const { slugOrId } = request.params as { slugOrId: string };

      // Try to find by slug first, then by ID for backward compatibility
      let product = await prisma.product.findUnique({
        where: { slug: slugOrId },
        include: { images: { orderBy: { order: 'asc' } } }
      });

      if (!product) {
        // Fallback to ID lookup (for backward compatibility with old URLs)
        product = await prisma.product.findUnique({
          where: { id: slugOrId },
          include: { images: { orderBy: { order: 'asc' } } }
        });
      }

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
      const { name, slug: providedSlug, description, price, sku, stock, isActive, images } =
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

      // Generate slug from name or use provided slug
      const baseSlug = providedSlug ? generateSlug(providedSlug) : generateSlug(name);
      const slug = await ensureUniqueSlug(baseSlug);

      // Create product with images
      const product = await prisma.product.create({
        data: {
          name,
          slug,
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
            slug: { type: 'string', minLength: 1 },
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
      const { name, slug: providedSlug, description, price, stock, isActive, images } =
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

      // Handle slug update
      let newSlug: string | undefined;
      if (providedSlug !== undefined) {
        // Use provided slug
        const baseSlug = generateSlug(providedSlug);
        newSlug = await ensureUniqueSlug(baseSlug, id);
      } else if (name !== undefined && name !== existingProduct.name) {
        // Auto-generate new slug when name changes
        const baseSlug = generateSlug(name);
        newSlug = await ensureUniqueSlug(baseSlug, id);
      }

      // Update product
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(newSlug !== undefined && { slug: newSlug }),
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
