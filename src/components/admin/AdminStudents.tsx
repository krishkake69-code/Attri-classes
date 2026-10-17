import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  UserPlus,
  Search,
  Trash2,
  Pencil,
  RefreshCw,
  Users,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import { BATCH_IDS, BATCH_INFO, batchLabel } from '../../lib/batches';
import type { BatchId, Student } from '../../types';

interface Props {
  onAuthError: () => void;
}

const emptyForm = {
  username: '',
  name: '',
  password: '',
  class: '11th' as '11th' | '12th',
  batchId: 'MON_TUE_WED_11' as BatchId,
  phone: '',
  email: '',
};

export default function AdminStudents({ onAuthError }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get('/api/admin/students');
      setStudents(res.students || []);
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not load students.');
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

  const filtered = students.filter((s) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      (s.phone || '').includes(q);
    const matchesBatch = !batchFilter || s.batchId === batchFilter;
    return matchesQuery && matchesBatch;
  });

  const counts = BATCH_IDS.reduce<Record<string, number>>((acc, id) => {
    acc[id] = students.filter((s) => s.batchId === id).length;
    return acc;
  }, {});

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (s: Student) => {
    setForm({
      username: s.username,
      name: s.name,
      password: '',
      class: s.class,
      batchId: s.batchId,
      phone: s.phone || '',
      email: s.email || '',
    });
    setEditing(s);
    setShowForm(true);
  };

  const submit = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        const body: any = {
          name: form.name,
          class: form.class,
          batchId: form.batchId,
          phone: form.phone,
          email: form.email,
        };
        if (form.password) body.password = form.password;
        await adminApi.put(`/api/admin/students/${editing.id}`, body);
        flash('Student updated.');
      } else {
        await adminApi.post('/api/admin/students', form);
        flash('Student added.');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditing(null);
      load();
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not save student.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: Student) => {
    if (!window.confirm(`Remove ${s.name} (@${s.username})? This deletes their records too.`)) return;
    setError('');
    try {
      await adminApi.del(`/api/admin/students/${s.id}`);
      flash('Student removed.');
      load();
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not remove student.');
    }
  };

  // Keep the batch selector in sync with the chosen class.
  const onClassChange = (cls: '11th' | '12th') => {
    setForm((f) => {
      const currentBatch = BATCH_INFO[f.batchId];
      const stillValid = currentBatch && currentBatch.className === cls;
      const fallback = BATCH_IDS.find((id) => BATCH_INFO[id].className === cls)!;
      return { ...f, class: cls, batchId: stillValid ? f.batchId : fallback };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" /> Students ({students.length})
          </h3>
          <p className="text-xs text-ink-faint">Add learners, assign them to one batch, reset passwords.</p>
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
            <UserPlus className="w-4 h-4" /> Add Student
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

      {/* Batch summary chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {BATCH_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setBatchFilter(batchFilter === id ? '' : id)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              batchFilter === id ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-line-strong'
            }`}
          >
            <p className="text-xs text-ink-faint">{BATCH_INFO[id].days}</p>
            <p className="text-sm font-semibold text-ink mt-0.5">{BATCH_INFO[id].name}</p>
            <p className="font-display text-xl font-semibold text-accent mt-1">{counts[id] || 0}</p>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, username or phone…"
            className="w-full rounded-xl border border-line bg-canvas pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="">All batches</option>
          {BATCH_IDS.map((id) => (
            <option key={id} value={id}>
              {BATCH_INFO[id].name}
            </option>
          ))}
        </select>
      </div>

      {/* Add / edit form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-2xl border border-line bg-surface p-5 space-y-4 overflow-hidden"
        >
          <h4 className="text-sm font-semibold text-ink uppercase tracking-wider">
            {editing ? 'Edit Student' : 'New Student'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full name *">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
                placeholder="e.g. Aarav Sharma"
              />
            </Field>
            {!editing && (
              <Field label="Username *">
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                  className={inputCls}
                  autoCapitalize="none"
                  placeholder="e.g. aarav11"
                />
              </Field>
            )}
            <Field label={editing ? 'New password (leave blank to keep)' : 'Password * (min 8 chars)'}>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputCls} pl-9`}
                  placeholder={editing ? '••••••••' : 'Set a strong password'}
                />
              </div>
            </Field>
            <Field label="Class *">
              <select
                value={form.class}
                onChange={(e) => onClassChange(e.target.value as '11th' | '12th')}
                className={inputCls}
              >
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </Field>
            <Field label="Batch *">
              <select
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value as BatchId })}
                className={inputCls}
              >
                {BATCH_IDS.filter((id) => BATCH_INFO[id].className === form.class).map((id) => (
                  <option key={id} value={id}>
                    {BATCH_INFO[id].name} ({BATCH_INFO[id].days})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Phone (optional)">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls}
                placeholder="10-digit number"
              />
            </Field>
            <Field label="Email (optional)">
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
                placeholder="student@email.com"
              />
            </Field>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={submit}
              disabled={saving || !form.name.trim() || (!editing && !form.username.trim()) || (!editing && form.password.length < 8)}
              className="bg-accent text-on-accent font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create student'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-surface-muted text-ink-soft font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-line/40 transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Student list */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-ink-faint text-sm">
          <RefreshCw className="h-5 w-5 animate-spin" /> Loading students…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-ink-faint" strokeWidth={1.5} />
          <p className="mt-3 text-ink font-medium">
            {students.length === 0 ? 'No students yet' : 'No matches'}
          </p>
          <p className="text-sm text-ink-faint mt-1">
            {students.length === 0 ? 'Add your first student to get started.' : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-line bg-surface-muted text-left text-xs uppercase tracking-wider text-ink-faint">
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">Class</th>
                  <th className="px-5 py-3 font-semibold">Batch</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-muted/50">
                    <td className="px-5 py-3">
                      <p className="text-ink font-medium">{s.name}</p>
                      <p className="text-xs text-ink-faint">@{s.username}</p>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{s.class}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                        {batchLabel(s.batchId)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-faint text-xs">
                      {s.phone || '—'}
                      {s.email && <span className="block">{s.email}</span>}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(s)}
                          className="rounded-lg p-2 text-ink-soft hover:text-accent hover:bg-accent-soft transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(s)}
                          className="rounded-lg p-2 text-ink-soft hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm outline-none focus:border-accent';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-soft mb-1">{label}</label>
      {children}
    </div>
  );
}
