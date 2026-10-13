import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shield, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Panel } from '@/components/ui/Panel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { AuthUser, UserRole } from '@/types/api';

type UserRecord = AuthUser & {
  isActive: boolean;
  createdAt: string;
};

const initialForm = {
  name: '',
  email: '',
  role: 'OPERATOR' as UserRole,
  password: '',
};

export function UsersPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [passwordMap, setPasswordMap] = useState<Record<string, string>>({});

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => apiFetch<UserRecord[]>('/users'),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiFetch<UserRecord>('/users', {
        method: 'POST',
        body: JSON.stringify(form),
      }),
    onSuccess: () => {
      setForm(initialForm);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UserRecord> }) =>
      apiFetch(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      apiFetch(`/users/${id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ password }),
      }),
    onSuccess: (_, variables) => {
      setPasswordMap((prev) => ({ ...prev, [variables.id]: '' }));
    },
  });

  const sortedUsers = useMemo(
    () => [...(usersQuery.data ?? [])].sort((a, b) => Number(b.isActive) - Number(a.isActive)),
    [usersQuery.data],
  );

  return (
    <div className="space-y-6">
      <Panel
        title="Gestión de Usuarios"
        subtitle="Alta de cuentas internas, roles administrativos y control de accesos"
        actions={
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-unisinu-red">
            <Shield className="h-3.5 w-3.5" />
            Control Institucional
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Formulario nuevo usuario */}
          <form
            className="space-y-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate();
            }}
          >
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wider">
              <UserPlus className="h-4 w-4 text-unisinu-red" />
              Nuevo Usuario
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Nombre Completo *</label>
              <input
                required
                placeholder="Ej. Juan Pérez"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Correo Institucional *</label>
              <input
                type="email"
                required
                placeholder="usuario@unisinu.edu.co"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Rol en la Plataforma *</label>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))
                }
                className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              >
                <option value="ADMIN">Administrador General</option>
                <option value="OPERATOR">Operador de Rutas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Contraseña Inicial *</label>
              <input
                placeholder="••••••••"
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              />
            </div>

            {createMutation.error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-unisinu-red">
                {createMutation.error.message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full rounded-xl bg-unisinu-red px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-unisinu-red-hover disabled:opacity-60"
            >
              {createMutation.isPending ? 'Creando...' : 'Crear Usuario'}
            </button>
          </form>

          {/* Tabla de usuarios con scroll horizontal seguro */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {sortedUsers.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="Aún no hay usuarios"
                  description="Crea la primera cuenta administrativa u operativa desde el formulario."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 font-semibold uppercase tracking-wider text-slate-500 text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Usuario</th>
                      <th className="px-4 py-3">Rol</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Fecha Alta</th>
                      <th className="px-4 py-3">Contraseña</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {user.role === 'ADMIN' ? 'Administrador' : 'Operador'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1.5 items-start">
                            <StatusBadge active={user.isActive} />
                            <button
                              type="button"
                              onClick={() =>
                                updateMutation.mutate({
                                  id: user.id,
                                  payload: { isActive: !user.isActive },
                                })
                              }
                              className="text-[11px] font-semibold text-unisinu-red hover:underline"
                            >
                              {user.isActive ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="password"
                              placeholder="Nueva clave"
                              value={passwordMap[user.id] ?? ''}
                              onChange={(event) =>
                                setPasswordMap((prev) => ({ ...prev, [user.id]: event.target.value }))
                              }
                              className="w-28 sm:w-32 rounded-lg border-2 border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-2 focus:ring-unisinu-red/20"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                passwordMutation.mutate({
                                  id: user.id,
                                  password: passwordMap[user.id] ?? '',
                                })
                              }
                              className="rounded-lg bg-unisinu-navy px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                            >
                              Guardar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
