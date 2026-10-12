import { useQuery } from '@tanstack/react-query';
import { getHomeStatus } from '../api';

export function useHomeStatus() {
  return useQuery({
    queryKey: ['home', 'status'],
    queryFn: getHomeStatus,
  });
}
