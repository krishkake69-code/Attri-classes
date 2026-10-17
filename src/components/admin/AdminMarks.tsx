import { useEffect, useMemo, useState } from 'react';
import {
  BookOpenCheck,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle2,
  UserSearch,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import { batchLabel, formatDate, todayISO } from '../../lib/batches';
import type { Student, MarkRecord } from '../../types';

interface Props {
  onAuthError: () => void;
}

const emptyForm = {
  studentId: '',
  testName: '',
  subject: '',
  date: todayISO(),
  maxMarks: '100',
  marksObtained: '',
  remarks: '',
};

const inputCls =
  'w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm outline-none focus:border-accent';

export default function AdminMarks({ onAuthError }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState('');
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<MarkRecord | null>(null);

  const loadStudents = async () => {
    try {
      const res = await adminApi.get('/api/admin/students');
      setStudents(res.students || []);
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not load students.');
    }
  };

  const loadMarks = async (id: string) => {
    if (!id) {
      setMarks([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get(`/api/admin/marks?studentId=${encodeURIComponent(id)}`);
      setMarks(res.marks || []);
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not load marks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadMarks(studentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  const selectedStudent = useMemo(() => students.find((s) => s.id === studentId), [students, studentId]);

  const avgPct =
    marks.length > 0
      ? Math.round(
          (marks.reduce((a, m) => a + (m.marksObtained / (m.maxMarks || 1)) * 100, 0) / marks.length) * 100
        ) / 100
      : 0;

  const openCreate = () => {
    setForm({ ...emptyForm, studentId });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (m: MarkRecord) => {
    setForm({
      studentId: m.studentId,
      testName: m.testName,
      subject: m.subject,
      date: m.date,
      maxMarks: String(m.maxMarks),
      marksObtained: String(m.marksObtained),
      remarks: m.remarks || '',
    });
    setEditing(m);
    setShowForm(true);
  };

  const submit = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await adminApi.put(`/api/admin/marks/${editing.id}`, {
          studentId,
          testName: form.testName,
          subject: form.subject,
          date: form.date,
          maxMarks: Number(form.maxMarks),
          marksObtained: Number(form.marksObtained),
          remarks: form.remarks,
        });
        flash('Mark updated.');
      } else {
        await adminApi.post('/api/admin/marks', { ...form, studentId });
        flash('Mark added.');
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      loadMarks(studentId);
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not save mark.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (m: MarkRecord) => {
    if (!window.confirm(`Delete "${m.testName}" for this student?`)) return;
    setError('');
    try {
      await adminApi.del(`/api/admin/marks/${m.id}?studentId=${encodeURIComponent(studentId)}`);
      flash('Mark deleted.');
      loadMarks(studentId);
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not delete mark.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-accent" /> Marks
          </h3>
          <p className="text-xs text-ink-faint">Select a student, then add or edit their test scores.</p>
        </div>
        {studentId && (
          <button
            onClick={openCreate}
            className="bg-accent text-on-accent font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-accent-strong transition-all"
          >
            <Plus className="w-4 h-4" /> Add mark
          </button>
        )}
      </div>

      {/* Student picker */}
      <div>
        <label className="block text-xs font-medium text-ink-soft mb-1">Student</label>
        <div className="relative">
          <UserSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className={`${inputCls} pl-9 min-w-[260px]`}
          >
            <option value="">— Choose a student —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (@{s.username}) · {s.class} · {batchLabel(s.batchId)}
              </option>
            ))}
          </select>
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

      {!studentId ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <BookOpenCheck className="mx-auto h-10 w-10 text-ink-faint" strokeWidth={1.5} />
          <p className="mt-3 text-ink font-medium">Pick a student to view their marks</p>
          <p className="text-sm text-ink-faint mt-1">Marks are stored per student.</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-ink-faint text-sm">
          <RefreshCw className="h-5 w-5 animate-spin" /> Loading marks…
        </div>
      ) : (
        <>
          {showForm && (
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
              <h4 className="text-sm font-semibold text-ink uppercase tracking-wider">
                {editing ? 'Edit Mark' : `New Mark — ${selectedStudent?.name || ''}`}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Test name *">
                  <input
                    value={form.testName}
                    onChange={(e) => setForm({ ...form, testName: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Unit Test 1"
                  />
                </Field>
                <Field label="Subject *">
                  <input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Chemistry"
                  />
                </Field>
                <Field label="Date *">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Max marks *">
                  <input
                    type="number"
                    value={form.maxMarks}
                    onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
                    className={inputCls}
                    min={1}
                  />
                </Field>
                <Field label="Marks obtained *">
                  <input
                    type="number"
                    value={form.marksObtained}
                    onChange={(e) => setForm({ ...form, marksObtained: e.target.value })}
                    className={inputCls}
                    min={0}
                  />
                </Field>
                <Field label="Remarks (optional)">
                  <input
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    className={inputCls}
                    placeholder="Great improvement"
                  />
                </Field>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={submit}
                  disabled={
                    saving ||
                    !form.testName.trim() ||
                    !form.subject.trim() ||
                    form.marksObtained === '' ||
                    Number(form.marksObtained) < 0 ||
                    Number(form.marksObtained) > Number(form.maxMarks)
                  }
                  className="bg-accent text-on-accent font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Add mark'}
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

          {marks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
              <BookOpenCheck className="mx-auto h-10 w-10 text-ink-faint" strokeWidth={1.5} />
              <p className="mt-3 text-ink font-medium">No marks yet</p>
              <p className="text-sm text-ink-faint mt-1">
                {selectedStudent?.name} has no recorded tests. Click “Add mark”.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-surface overflow-hidden">
              <div className="px-5 py-3 border-b border-line bg-surface-muted flex items-center justify-between">
                <p className="text-sm text-ink font-medium">{selectedStudent?.name}</p>
                <p className="text-xs text-ink-faint">
                  {marks.length} test{marks.length === 1 ? '' : 's'} · Avg {avgPct}%
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-faint">
                      <th className="px-5 py-3 font-semibold">Test</th>
                      <th className="px-5 py-3 font-semibold">Subject</th>
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold text-right">Score</th>
                      <th className="px-5 py-3 font-semibold text-right">%</th>
                      <th className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {marks.map((m) => {
                      const pct = m.maxMarks ? Math.round((m.marksObtained / m.maxMarks) * 100) : 0;
                      return (
                        <tr key={m.id} className="hover:bg-surface-muted/50">
                          <td className="px-5 py-3 text-ink font-medium">{m.testName}</td>
                          <td className="px-5 py-3 text-ink-soft">{m.subject}</td>
                          <td className="px-5 py-3 text-ink-faint">{formatDate(m.date)}</td>
                          <td className="px-5 py-3 text-right text-ink">
                            {m.marksObtained} / {m.maxMarks}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                pct >= 75
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : pct >= 40
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {pct}%
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEdit(m)}
                                className="rounded-lg p-2 text-ink-soft hover:text-accent hover:bg-accent-soft transition-colors"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => remove(m)}
                                className="rounded-lg p-2 text-ink-soft hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
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
