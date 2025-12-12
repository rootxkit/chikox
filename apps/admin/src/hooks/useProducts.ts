import useSWR from 'swr';
import { productsApi } from '@/lib/api';
import type { ProductDTO } from '@chikox/types';

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<ProductDTO[]>(
    '/api/v1/products',
    productsApi.getAll
  );

  return {
    products: data,
    isLoading,
    error,
    mutate
  };
}
