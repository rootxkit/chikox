import useSWR from 'swr';
import { usersApi } from '@/lib/api';
import type { UserDTO } from '@chikox/types';

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<UserDTO[]>('/api/v1/users', usersApi.getAll);

  return {
    users: data,
    isLoading,
    error,
    mutate
  };
}
