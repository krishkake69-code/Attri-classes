import type { BatchId } from '../types';

export const BATCH_IDS: BatchId[] = [
  'MON_TUE_WED_11',
  'MON_TUE_WED_12',
  'FRI_SAT_SUN_11',
  'FRI_SAT_SUN_12',
];

export const BATCH_INFO: Record<BatchId, { name: string; days: string; className: '11th' | '12th' }> = {
  MON_TUE_WED_11: { name: 'Mon-Tue-Wed | 11th', days: 'Mon, Tue, Wed', className: '11th' },
  MON_TUE_WED_12: { name: 'Mon-Tue-Wed | 12th', days: 'Mon, Tue, Wed', className: '12th' },
  FRI_SAT_SUN_11: { name: 'Fri-Sat-Sun | 11th', days: 'Fri, Sat, Sun', className: '11th' },
  FRI_SAT_SUN_12: { name: 'Fri-Sat-Sun | 12th', days: 'Fri, Sat, Sun', className: '12th' },
};

export function batchLabel(id?: string) {
  return id && BATCH_INFO[id as BatchId] ? BATCH_INFO[id as BatchId].name : 'Not assigned';
}

export function formatDate(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
