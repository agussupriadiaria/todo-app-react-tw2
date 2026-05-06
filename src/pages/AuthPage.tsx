import { useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CheckSquare, Eye, EyeOff, Loader2 } from 'lucide-react';

type Mode = 'login' | 'register';

export function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-accent">
      <Loader2 className="animate-spin" size={32} />
    </div>
  );

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === 'register' && password !== confirmPassword) {
      setError('Password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setSubmitting(true);

    if (mode === 'register') {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess('Registrasi berhasil! Silakan cek email untuk verifikasi, lalu login.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) setError('Email atau password salah.');
    }

    setSubmitting(false);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setSuccess(null);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-accent blur-[80px] opacity-15 -top-[100px] -left-[100px]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#a78bfa] blur-[80px] opacity-15 -bottom-[80px] -right-[80px]" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-green blur-[80px] opacity-15 bottom-[30%] left-[40%]" />
      </div>

      <div className="relative z-10 bg-bg-card border border-border rounded-[20px] p-10 w-full max-w-[420px] shadow-card shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 text-accent text-xl font-bold mb-7 tracking-tight">
          <CheckSquare size={28} />
          <span>Taskly</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-bg rounded-sm p-1 mb-7 relative">
          <button
            className={`flex-1 bg-transparent border-none text-sm font-medium py-2 px-0 cursor-pointer rounded-[6px] transition-colors duration-[0.18s] relative z-10 ${mode === 'login' ? 'text-text' : 'text-text-muted'}`}
            onClick={() => switchMode('login')}
            type="button"
          >
            Masuk
          </button>
          <button
            className={`flex-1 bg-transparent border-none text-sm font-medium py-2 px-0 cursor-pointer rounded-[6px] transition-colors duration-[0.18s] relative z-10 ${mode === 'register' ? 'text-text' : 'text-text-muted'}`}
            onClick={() => switchMode('register')}
            type="button"
          >
            Daftar
          </button>
          <div
            className={`absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-bg-card2 rounded-[6px] border border-border transition-transform duration-[0.18s] ${mode === 'register' ? 'translate-x-[calc(100%+0px)]' : ''}`}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-text-muted tracking-[0.02em]">Email</label>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="bg-bg border border-border rounded-sm text-text font-sans text-sm px-3.5 py-2.5 outline-none transition-all duration-[0.18s] w-full focus:border-accent focus:shadow-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-text-muted tracking-[0.02em]">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="bg-bg border border-border rounded-sm text-text font-sans text-sm px-3.5 py-2.5 pr-10 outline-none transition-all duration-[0.18s] w-full focus:border-accent focus:shadow-input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-text-muted cursor-pointer flex items-center transition-colors duration-[0.18s] hover:text-text"
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-password" className="text-xs font-medium text-text-muted tracking-[0.02em]">Konfirmasi Password</label>
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="bg-bg border border-border rounded-sm text-text font-sans text-sm px-3.5 py-2.5 outline-none transition-all duration-[0.18s] w-full focus:border-accent focus:shadow-input"
              />
            </div>
          )}

          {error && (
            <p className="bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.3)] rounded-sm text-red text-[13px] px-3.5 py-2.5">
              {error}
            </p>
          )}
          {success && (
            <p className="bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.3)] rounded-sm text-green text-[13px] px-3.5 py-2.5">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-accent text-white border-none rounded-sm font-sans text-sm font-semibold px-5 py-[11px] cursor-pointer transition-all duration-[0.18s] tracking-[0.01em] hover:bg-accent-hover hover:shadow-accent hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? <><Loader2 size={16} className="animate-spin" /> Memproses...</>
              : mode === 'login' ? 'Masuk' : 'Buat Akun'
            }
          </button>
        </form>

        <p className="mt-5 text-center text-[13px] text-text-muted">
          {mode === 'login'
            ? <>Belum punya akun? <button onClick={() => switchMode('register')} className="bg-transparent border-none text-accent cursor-pointer text-[13px] font-medium underline">Daftar sekarang</button></>
            : <>Sudah punya akun? <button onClick={() => switchMode('login')} className="bg-transparent border-none text-accent cursor-pointer text-[13px] font-medium underline">Masuk</button></>
          }
        </p>
      </div>
    </div>
  );
}
