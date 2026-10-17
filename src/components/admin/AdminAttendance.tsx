import { useEffect, useState } from 'react';
import {
  CalendarCheck2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  AlertCircle,
  Users,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import { BATCH_IDS, BATCH_INFO, todayISO } from '../../lib/batches';
import type { BatchId, AttendanceStatus } from '../../types';

interface Props {
  onAuthError: () => void;
}

interface Row {
  studentId: string;
  name: string;
  username: string;
  batchId: string;
  status: AttendanceStatus | null;
}

const STATUS_BTN: Record<AttendanceStatus, { label: string; icon: typeof CheckCircle2; active: string; idle: string }> = {
  present: {
    label: 'Present',
    icon: CheckCircle2,
    active: 'bg-emerald-600 text-white',
    idle: 'text-emerald-700 hover:bg-emerald-50',
  },
  late: { label: 'Late', icon: Clock, active: 'bg-amber-500 text-white', idle: 'text-amber-700 hover:bg-amber-50' },
  absent: { label: 'Absent', icon: XCircle, active: 'bg-red-600 text-white', idle: 'text-red-700 hover:bg-red-50' },
};

export default function AdminAttendance({ onAuthError }: Props) {
  const [date, setDate] = useState(todayISO());
  const [batchId, setBatchId] = useState<string>(BATCH_IDS[0]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get(
        `/api/admin/attendance?date=${encodeURIComponent(date)}&batchId=${encodeURIComponent(batchId)}`
      );
      setRows(res.records || []);
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not load attendance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, batchId]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setRows((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  };

  const markAll = (status: AttendanceStatus) => {
    setRows((prev) => prev.map((r) => ({ ...r, status })));
  };

  const save = async () => {
    const entries = rows.filter((r) => r.status).map((r) => ({ studentId: r.studentId, status: r.status }));
    if (entries.length === 0) {
      setError('Set a status for at least one student before saving.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await adminApi.put('/api/admin/attendance', { date, entries });
      setNotice(`Saved attendance for ${res.updated} student${res.updated === 1 ? '' : 's'}.`);
      setTimeout(() => setNotice(''), 3500);
      load();
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const marked = rows.filter((r) => r.status).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5 text-accent" /> Mark Attendance
          </h3>
          <p className="text-xs text-ink-faint">Pick a date and batch, then mark each student.</p>
        </div>
        <button
          onClick={load}
          className="bg-surface-muted text-ink font-bold text-xs uppercase tracking-wider px-3 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-line/40 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Reload
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value || todayISO())}
            className="rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1">Batch</label>
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm outline-none focus:border-accent min-w-[220px]"
          >
            {BATCH_IDS.map((id) => (
              <option key={id} value={id}>
                {BATCH_INFO[id].name} ({BATCH_INFO[id].days})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAll('present')}
            className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-2.5 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            All present
          </button>
          <button
            onClick={() => markAll('absent')}
            className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2.5 text-xs font-semibold hover:bg-red-100 transition-colors"
          >
            All absent
          </button>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> {notice}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-ink-faint text-sm">
          <RefreshCw className="h-5 w-5 animate-spin" /> Loading batch…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-ink-faint" strokeWidth={1.5} />
          <p className="mt-3 text-ink font-medium">No students in this batch</p>
          <p className="text-sm text-ink-faint mt-1">Add students from the Students tab first.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <div className="px-5 py-3 border-b border-line bg-surface-muted flex items-center justify-between">
            <p className="text-sm text-ink font-medium">
              {BATCH_INFO[batchId as BatchId]?.name} · {rows.length} student{rows.length === 1 ? '' : 's'}
            </p>
            <p className="text-xs text-ink-faint">{marked} marked</p>
          </div>
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <li key={r.studentId} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-ink font-medium">{r.name}</p>
                  <p className="text-xs text-ink-faint">@{r.username}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {(Object.keys(STATUS_BTN) as AttendanceStatus[]).map((st) => {
                    const cfg = STATUS_BTN[st];
                    const Icon = cfg.icon;
                    const active = r.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setStatus(r.studentId, st)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          active
                            ? `${cfg.active} border-transparent`
                            : `border-line ${cfg.idle}`
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
          <div className="px-5 py-4 border-t border-line bg-surface-muted flex items-center justify-between gap-3">
            <p className="text-xs text-ink-faint">Changes save for the selected date only.</p>
            <button
              onClick={save}
              disabled={saving || marked === 0}
              className="inline-flex items-center gap-2 bg-accent text-on-accent font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : `Save attendance (${marked})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
