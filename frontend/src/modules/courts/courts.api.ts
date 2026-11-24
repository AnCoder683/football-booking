import { api } from '../../lib/api';
import type { Branch } from '../branches/branches.api';

export type Court = {
  id: string;
  name: string;
  playersPerTeam: number;
  pricePerSlot: number;
  isActive: boolean;
  branch: Branch;
};

export type CourtsResponse = {
  success: true;
  data: Court[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type AvailableStart = { startAt: string; endAt: string };

export function getCourtsApi(page: number, branchId: string, signal: AbortSignal) {
  return api.get<CourtsResponse>('/courts', {
    params: { page, limit: 10, branchId: branchId || undefined },
    signal,
  });
}

export function getCourtApi(courtId: string, signal: AbortSignal) {
  return api.get<{ data: Court }>(`/courts/${courtId}`, { signal });
}

export function getCourtAvailabilityApi(courtId: string, date: string, durationMinutes: number, signal: AbortSignal) {
  return api.get<{ data: { availableStarts: AvailableStart[] } }>(`/courts/${courtId}/availability`, {
    params: { date, durationMinutes },
    signal,
  });
}
