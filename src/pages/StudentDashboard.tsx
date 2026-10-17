import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  LogOut,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Layers,
  RefreshCw,
  User,
} from 'lucide-react';
import { studentApi, clearStudentToken, getStudentToken } from '../lib/api';
import type { StudentMe, AttendanceRecord, MarkRecord, CalendarEvent, BatchId } from '../types';
import { BATCH_INFO, batchLabel, formatDate } from '../lib/batches';

function statusIcon(status: string) {
  if (status === 'present') return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (status === 'late') return <Clock className="h-4 w-4 text-amber-600" />;
  return <XCircle className="h-4 w-4 text-red-600" />;
}

/* ------------------------------------------------------------------ */
/* Tab definitions                                                     */
/* ------------------------------------------------------------------ */

type Tab = 'overview' | 'marks' | 'attendance' | 'batch' | 'calendar';

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'marks', label: 'Marks', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
  { id: 'batch', label: 'My Batch', icon: Layers },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface StudentDashboardProps {
  onLoggedOut: () => void;
}

export default function StudentDashboard({ onLoggedOut }: StudentDashboardProps) {
  const [data, setData] = useState<StudentMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await studentApi.me();
      if (res.success) {
        setData(res as StudentMe);
      } else {
        setError(res.error || 'Could not load your data.');
      }
    } catch (err: any) {
      setError(err?.message || 'Could not load your data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getStudentToken()) {
      onLoggedOut();
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    clearStudentToken();
    onLoggedOut();
  };

  const student = data?.student;
  const marks = (data?.marks || []) as MarkRecord[];
  const attendance = (data?.attendance || []) as AttendanceRecord[];
  const calendar = (data?.calendar || []) as CalendarEvent[];

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;
  const absentCount = attendance.filter((a) => a.status === 'absent').length;
  const attendancePct =
    attendance.length > 0 ? Math.round(((presentCount + lateCount) / attendance.length) * 100) : 0;

  const avgPct =
    marks.length > 0
      ? Math.round(
          (marks.reduce((acc, m) => acc + (m.marksObtained / (m.maxMarks || 1)) * 100, 0) /
            marks.length) *
            100
        ) / 100
      : 0;

  const years = Array.from(
    new Set(calendar.map((e) => e.date?.slice(0, 4)).filter(Boolean))
  ).sort();
  const visibleEvents = calendar
    .filter((e) => !e.date || e.date.startsWith(String(currentYear)))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="min-h-[100dvh] bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent">
              <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-ink truncate leading-tight">
                {student?.name || 'Student Portal'}
              </p>
              <p className="text-xs text-ink-faint truncate">
                {student ? `@${student.username} · ${student.class}` : 'Loading…'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-ink-soft hover:text-ink hover:border-line-strong transition-colors"
          >
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-faint">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <p className="text-sm">Loading your dashboard…</p>
          </div>
        ) : error && !data ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={load}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:bg-accent-strong transition-colors"
              >
                Try again
              </button>
              <button
                onClick={logout}
                className="rounded-lg border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink"
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab nav */}
            <nav className="mb-6 -mx-1 overflow-x-auto">
              <div className="flex gap-1 px-1 min-w-max">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-accent text-on-accent'
                          : 'text-ink-soft hover:text-ink hover:bg-surface-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* ---------------------------- Overview ---------------------------- */}
            {tab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Attendance" value={`${attendancePct}%`} sub={`${attendance.length} classes marked`} />
                  <StatCard
                    label="Present"
                    value={String(presentCount)}
                    sub={`${absentCount} absent · ${lateCount} late`}
                  />
                  <StatCard
                    label="Tests Taken"
                    value={String(marks.length)}
                    sub={marks.length ? `Avg ${avgPct}%` : 'No tests yet'}
                  />
                  <StatCard label="Batch" value={student ? student.class : '—'} sub={batchLabel(student?.batchId)} />
                </div>

                <div className="rounded-2xl border border-line bg-surface overflow-hidden">
                  <div className="px-6 py-4 border-b border-line bg-surface-muted">
                    <h2 className="font-display font-semibold text-ink">My Profile</h2>
                  </div>
                  <dl className="divide-y divide-line">
                    <ProfileRow label="Full name" value={student?.name} />
                    <ProfileRow label="Username" value={student?.username} />
                    <ProfileRow label="Class" value={student?.class} />
                    <ProfileRow label="Batch" value={batchLabel(student?.batchId)} />
                    <ProfileRow label="Phone" value={student?.phone} />
                    <ProfileRow label="Email" value={student?.email} />
                    <ProfileRow
                      label="Subjects"
                      value={student?.subjects?.length ? student.subjects.join(', ') : undefined}
                    />
                    <ProfileRow label="Enrolled on" value={formatDate(student?.createdAt || '')} />
                  </dl>
                </div>
              </motion.div>
            )}

            {/* ----------------------------- Marks ------------------------------ */}
            {tab === 'marks' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {marks.length === 0 ? (
                  <EmptyState icon={BookOpen} title="No marks yet" text="Your test results will appear here once your teacher uploads them." />
                ) : (
                  <div className="rounded-2xl border border-line bg-surface overflow-hidden">
                    <div className="px-6 py-4 border-b border-line bg-surface-muted flex items-center justify-between">
                      <h2 className="font-display font-semibold text-ink">Test Results</h2>
                      <span className="text-sm text-ink-faint">Average {avgPct}%</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[560px]">
                        <thead>
                          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-faint">
                            <th className="px-6 py-3 font-semibold">Test</th>
                            <th className="px-6 py-3 font-semibold">Subject</th>
                            <th className="px-6 py-3 font-semibold">Date</th>
                            <th className="px-6 py-3 font-semibold text-right">Score</th>
                            <th className="px-6 py-3 font-semibold text-right">%</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {marks.map((m) => {
                            const pct = m.maxMarks ? Math.round((m.marksObtained / m.maxMarks) * 100) : 0;
                            return (
                              <tr key={m.id} className="hover:bg-surface-muted/50">
                                <td className="px-6 py-3.5 text-ink font-medium">{m.testName}</td>
                                <td className="px-6 py-3.5 text-ink-soft">{m.subject}</td>
                                <td className="px-6 py-3.5 text-ink-faint">{formatDate(m.date)}</td>
                                <td className="px-6 py-3.5 text-right text-ink">
                                  {m.marksObtained} / {m.maxMarks}
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* --------------------------- Attendance --------------------------- */}
            {tab === 'attendance' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {attendance.length === 0 ? (
                  <EmptyState icon={CheckCircle2} title="No attendance yet" text="Your attendance record will appear here once your teacher starts marking it." />
                ) : (
                  <div className="rounded-2xl border border-line bg-surface overflow-hidden">
                    <div className="px-6 py-4 border-b border-line bg-surface-muted flex items-center justify-between">
                      <h2 className="font-display font-semibold text-ink">Attendance Record</h2>
                      <span className="text-sm text-ink-faint">{attendancePct}% attendance</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[520px]">
                        <thead>
                          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-faint">
                            <th className="px-6 py-3 font-semibold">Date</th>
                            <th className="px-6 py-3 font-semibold">Batch</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {attendance.map((a) => (
                            <tr key={a.id} className="hover:bg-surface-muted/50">
                              <td className="px-6 py-3.5 text-ink font-medium">{formatDate(a.date)}</td>
                              <td className="px-6 py-3.5 text-ink-soft">{batchLabel(a.batchId)}</td>
                              <td className="px-6 py-3.5">
                                <span className="inline-flex items-center gap-1.5 capitalize text-ink-soft">
                                  {statusIcon(a.status)}
                                  {a.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ----------------------------- Batch ------------------------------ */}
            {tab === 'batch' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {student && (
                  <div className="rounded-2xl border border-line bg-surface p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                        <Layers className="h-6 w-6" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h2 className="font-display text-lg font-semibold text-ink">
                          {batchLabel(student.batchId)}
                        </h2>
                        <p className="text-sm text-ink-soft mt-0.5">
                          {BATCH_INFO[student.batchId as BatchId]?.days || 'No days scheduled'}
                        </p>
                        <p className="text-sm text-ink-faint mt-2">
                          You attend classes on the days listed above. Your teacher assigned you to this batch — students can only belong to one batch.
                        </p>
                      </div>
                    </div>
                    <dl className="mt-6 grid grid-cols-2 gap-4">
                      <ProfileRow label="Class" value={student.class} />
                      <ProfileRow label="Batch code" value={student.batchId} />
                    </dl>
                  </div>
                )}

                <div className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="font-display font-semibold text-ink mb-4">All batches</h3>
                  <ul className="divide-y divide-line">
                    {(Object.keys(BATCH_INFO) as BatchId[]).map((id) => {
                      const b = BATCH_INFO[id];
                      const active = student?.batchId === id;
                      return (
                        <li key={id} className={`flex items-center justify-between py-3 ${active ? 'text-accent font-medium' : 'text-ink-soft'}`}>
                          <span>{b.name}</span>
                          <span className="text-xs">{b.days}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* ---------------------------- Calendar ---------------------------- */}
            {tab === 'calendar' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-2xl border border-line bg-surface overflow-hidden">
                  <div className="px-6 py-4 border-b border-line bg-surface-muted flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display font-semibold text-ink">Calendar</h2>
                    {years.length > 0 && (
                      <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
                        className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-sm text-ink outline-none focus:border-accent"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {visibleEvents.length === 0 ? (
                    <EmptyState icon={CalendarDays} title={`No events for ${currentYear}`} text="Events added by your teacher will show up here automatically." />
                  ) : (
                    <ul className="divide-y divide-line">
                      {visibleEvents.map((e) => (
                        <li key={e.id} className="flex items-start gap-4 px-6 py-4">
                          <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-soft text-accent leading-none">
                            <span className="text-base font-semibold">{e.date?.slice(8, 10)}</span>
                            <span className="text-[10px] uppercase">{e.date?.slice(5, 7)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-ink font-medium">{e.title}</p>
                            {e.description && <p className="text-sm text-ink-soft mt-0.5">{e.description}</p>}
                            <p className="text-xs text-ink-faint mt-1">
                              {formatDate(e.date)}
                              {e.endDate && e.endDate !== e.date ? ` – ${formatDate(e.endDate)}` : ''}
                              {e.batchId && ` · ${batchLabel(e.batchId)}`}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-faint">{sub}</p>}
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5">
      <dt className="text-sm text-ink-faint">{label}</dt>
      <dd className="text-sm text-ink font-medium">{value && value.trim() ? value : '—'}</dd>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BookOpen;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
      <Icon className="mx-auto h-10 w-10 text-ink-faint" strokeWidth={1.5} />
      <h3 className="mt-4 font-display font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-faint max-w-sm mx-auto">{text}</p>
    </div>
  );
}
