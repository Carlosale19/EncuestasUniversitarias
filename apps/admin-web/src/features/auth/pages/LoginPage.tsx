import { useMutation } from '@tanstack/react-query';
import { KeyRound, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '../hooks/useAuthStore';
import type { LoginResponse } from '@/types/api';

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: () =>
      apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      }),
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      navigate('/dashboard');
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#000000_0%,#2b0000_45%,#4f0000_100%)] px-4 py-8">
      <section className="w-full max-w-md rounded-[32px] border border-red-500/20 bg-white p-8 text-slate-900 shadow-2xl">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            loginMutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-red-700" />
              Correo
            </span>
            <input
              type="email"
              value={form.email}
              required
              autoComplete="username"
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-red-600"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <KeyRound className="h-4 w-4 text-red-700" />
              Contrasena
            </span>
            <input
              type="password"
              value={form.password}
              required
              autoComplete="current-password"
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-red-600"
            />
          </label>

          {loginMutation.error ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {loginMutation.error.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-2xl bg-red-700 px-4 py-3 font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </div>
  );
}
