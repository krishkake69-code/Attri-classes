import { useEffect, useMemo, useState } from 'react';
import {
  CalendarPlus,
  CalendarDays,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import { BATCH_IDS, BATCH_INFO, batchLabel, formatDate, todayISO } from '../../lib/batches';
import type { CalendarEvent } from '../../types';

interface Props {
  onAuthError: () => void;
}

const emptyForm = {
  title: '',
  description: '',
  date: todayISO(),
  endDate: '',
  batchId: '',
  class: 'all' as '11th' | '12th' | 'all',
};

const inputCls =
  'w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm outline-none focus:border-accent';

export default function AdminCalendar({ onAuthError }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [yearFilter, setYearFilter] = useState<string>('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get('/api/admin/calendar');
      setEvents(res.calendar || []);
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not load calendar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  const years = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.date && set.add(e.date.slice(0, 4)));
    return Array.from(set).sort();
  }, [events]);

  const visible = useMemo(() => {
    const list = yearFilter ? events.filter((e) => e.date?.startsWith(yearFilter)) : events;
    return [...list].sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [events, yearFilter]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (e: CalendarEvent) => {
    setForm({
      title: e.title,
      description: e.description || '',
      date: e.date,
      endDate: e.endDate || '',
      batchId: e.batchId || '',
      class: (e.class as '11th' | '12th' | 'all') || 'all',
    });
    setEditing(e);
    setShowForm(true);
  };

  const submit = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await adminApi.put(`/api/admin/calendar/${editing.id}`, form);
        flash('Event updated.');
      } else {
        await adminApi.post('/api/admin/calendar', form);
        flash('Event added.');
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      load();
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not save event.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (e: CalendarEvent) => {
    if (!window.confirm(`Delete "${e.title}"?`)) return;
    setError('');
    try {
      await adminApi.del(`/api/admin/calendar/${e.id}`);
      flash('Event deleted.');
      load();
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not delete event.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-accent" /> Calendar
          </h3>
          <p className="text-xs text-ink-faint">
            Add tests, holidays and events. Students see them automatically by date & year.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="bg-surface-muted text-ink font-bold text-xs uppercase tracking-wider px-3 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-line/40 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={openCreate}
            className="bg-accent text-on-accent font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-accent-strong transition-all"
          >
            <Plus className="w-4 h-4" /> Add event
          </button>
        </div>
      </div>

      {years.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-faint">Year:</span>
          <button
            onClick={() => setYearFilter('')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              !yearFilter ? 'bg-ink text-canvas' : 'border border-line text-ink-soft hover:bg-surface-muted'
            }`}
          >
            All
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYearFilter(y)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                yearFilter === y ? 'bg-ink text-canvas' : 'border border-line text-ink-soft hover:bg-surface-muted'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}

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

      {showForm && (
        <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
          <h4 className="text-sm font-semibold text-ink uppercase tracking-wider">
            {editing ? 'Edit Event' : 'New Event'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title *">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
                placeholder="e.g. Unit Test 2"
              />
            </Field>
            <Field label="Audience">
              <select
                value={form.class}
                onChange={(e) => setForm({ ...form, class: e.target.value as '11th' | '12th' | 'all' })}
                className={inputCls}
              >
                <option value="all">Everyone</option>
                <option value="11th">Class 11th only</option>
                <option value="12th">Class 12th only</option>
              </select>
            </Field>
            <Field label="Start date *">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="End date (optional)">
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Specific batch (optional)">
              <select
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                className={inputCls}
              >
                <option value="">All batches</option>
                {BATCH_IDS.map((id) => (
                  <option key={id} value={id}>
                    {BATCH_INFO[id].name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description (optional)">
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputCls}
                placeholder="Bring your practical file"
              />
            </Field>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={submit}
              disabled={saving || !form.title.trim()}
              className="inline-flex items-center gap-2 bg-accent text-on-accent font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : editing ? 'Save changes' : 'Add event'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-surface-muted text-ink-soft font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-line/40 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-ink-faint text-sm">
          <RefreshCw className="h-5 w-5 animate-spin" /> Loading calendar…
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-ink-faint" strokeWidth={1.5} />
          <p className="mt-3 text-ink font-medium">No events{yearFilter ? ` in ${yearFilter}` : ''}</p>
          <p className="text-sm text-ink-faint mt-1">Add tests, holidays or important dates.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <ul className="divide-y divide-line">
            {visible.map((e) => (
              <li key={e.id} className="flex flex-wrap items-start gap-4 px-5 py-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-soft text-accent leading-none">
                  <span className="font-display text-base font-semibold">{e.date?.slice(8, 10)}</span>
                  <span className="text-[10px] uppercase">{e.date?.slice(5, 7)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-ink font-medium">{e.title}</p>
                  {e.description && <p className="text-sm text-ink-soft mt-0.5">{e.description}</p>}
                  <p className="text-xs text-ink-faint mt-1">
                    {formatDate(e.date)}
                    {e.endDate && e.endDate !== e.date ? ` – ${formatDate(e.endDate)}` : ''}
                    {' · '}
                    {e.batchId ? batchLabel(e.batchId) : e.class === 'all' ? 'All classes' : `Class ${e.class}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(e)}
                    className="rounded-lg p-2 text-ink-soft hover:text-accent hover:bg-accent-soft transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(e)}
                    className="rounded-lg p-2 text-ink-soft hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-soft mb-1">{label}</label>
      {children}
    </div>
  );
}
