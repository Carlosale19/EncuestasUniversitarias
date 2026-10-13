import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '../hooks/useAuthStore';
import type { LoginResponse } from '@/types/api';

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative flex min-h-screen flex-col justify-between bg-slate-100 text-slate-900">
      {/* Barra superior institucional Unisinú */}
      <div className="h-2.5 w-full bg-unisinu-red shadow-sm" />

      {/* Contenedor central responsive */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="w-full max-w-md overflow-hidden rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8">
          {/* Encabezado con Logos y Titular Unisinú */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center">
              <img
                src="/logo-unisinu-rojo.png"
                alt="Universidad del Sinú Seccional Cartagena"
                className="h-14 w-auto object-contain sm:h-16"
              />
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-unisinu-red">
              <ShieldCheck className="h-4 w-4" />
              Portal Administrativo
            </div>

            <h1 className="mt-3 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              Encuestas Universitarias
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
              Gestión y analítica de movilidad y rutas de transporte
            </p>
          </div>

          {/* Formulario */}
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              loginMutation.mutate();
            }}
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Correo Electrónico
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={form.email}
                  required
                  placeholder="admin@universidad.edu"
                  autoComplete="username"
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="w-full rounded-xl border-2 border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:bg-white focus:ring-4 focus:ring-unisinu-red/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Contraseña
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  className="w-full rounded-xl border-2 border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:bg-white focus:ring-4 focus:ring-unisinu-red/15"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-600 hover:text-slate-900"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {loginMutation.error ? (
              <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-semibold text-unisinu-red">
                {loginMutation.error.message || 'Error al iniciar sesión. Verifique sus credenciales.'}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-unisinu-red px-4 py-3 text-sm font-bold text-white shadow-md shadow-red-600/30 transition hover:bg-unisinu-red-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </section>
      </main>

      {/* Pie de página institucional Unisinú */}
      <footer className="border-t border-slate-300 bg-white py-4 text-center text-xs text-slate-700">
        <p className="font-semibold text-slate-800">
          Universidad del Sinú Elías Bechara Zainúm · Seccional Cartagena
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Institución de Educación Superior sujeta a inspección y vigilancia por el MEN
        </p>
      </footer>
    </div>
  );
}
