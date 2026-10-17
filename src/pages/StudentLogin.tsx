import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Lock, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { studentApi, setStudentToken } from '../lib/api';

interface StudentLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function StudentLogin({ onSuccess, onBack }: StudentLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await studentApi.login({ username: username.trim(), password });
      if (res.success && res.token) {
        setStudentToken(res.token);
        onSuccess();
      } else {
        setError(res.error || 'Login failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-canvas flex items-center justify-center p-4 relative overflow-hidden">
      {/* subtle grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-accent-soft blur-[120px]"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>

        <div className="bg-surface rounded-2xl border border-line shadow-xl overflow-hidden">
          <div className="px-7 pt-7 pb-6 border-b border-line bg-surface-muted">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-on-accent">
                <GraduationCap className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-ink">Student Portal</h1>
                <p className="text-sm text-ink-faint">Sign in to view your marks & attendance</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your username"
                  className="w-full rounded-xl border border-line bg-canvas pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-line bg-canvas pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !username.trim() || !password}
              className="w-full rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <p className="text-center text-xs text-ink-faint">
              Your username and password are issued by your teacher. Students have view-only access.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
