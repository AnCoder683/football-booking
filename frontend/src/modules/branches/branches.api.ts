import { api } from '../../lib/api';

export type Branch = { id: string; name: string; address: string };

export function getBranchesApi(signal: AbortSignal) {
  return api.get<{ data: Branch[] }>('/branches', { signal });
}
