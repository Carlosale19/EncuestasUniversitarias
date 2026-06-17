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
        title="Gestion de usuarios"
        subtitle="Alta de cuentas internas, control de roles y cambio directo de contrasenas"
        actions={
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm text-red-700">
            <Shield className="h-4 w-4" />
            Acceso sin registro publico
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <form
            className="space-y-4 rounded-[24px] bg-slate-50 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate();
            }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <UserPlus className="h-4 w-4" />
              Nuevo usuario
            </div>
            <input
              placeholder="Nombre completo"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
            <input
              placeholder="Correo institucional"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
            <select
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            >
              <option value="ADMIN">Administrador</option>
              <option value="OPERATOR">Operador</option>
            </select>
            <input
              placeholder="Contrasena inicial"
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
            {createMutation.error ? (
              <p className="text-sm text-rose-600">{createMutation.error.message}</p>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white"
            >
              Crear usuario
            </button>
          </form>

          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            {sortedUsers.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="Aun no hay usuarios"
                  description="Crea la primera cuenta administrativa u operativa desde el formulario."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Usuario</th>
                      <th className="px-4 py-3 font-medium">Rol</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3 font-medium">Creado</th>
                      <th className="px-4 py-3 font-medium">Contrasena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((user) => (
                      <tr key={user.id} className="border-t border-slate-100 align-top">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-slate-500">{user.email}</p>
                        </td>
                        <td className="px-4 py-4">{user.role === 'ADMIN' ? 'Administrador' : 'Operador'}</td>
                        <td className="px-4 py-4">
                          <div className="space-y-3">
                            <StatusBadge active={user.isActive} />
                            <button
                              type="button"
                              onClick={() =>
                                updateMutation.mutate({
                                  id: user.id,
                                  payload: { isActive: !user.isActive },
                                })
                              }
                              className="block text-sm font-medium text-red-700"
                            >
                              {user.isActive ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-500">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-4">
                          <div className="space-y-3">
                            <input
                              type="password"
                              placeholder="Nueva contrasena"
                              value={passwordMap[user.id] ?? ''}
                              onChange={(event) =>
                                setPasswordMap((prev) => ({ ...prev, [user.id]: event.target.value }))
                              }
                              className="w-full rounded-xl border border-slate-200 px-3 py-2"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                passwordMutation.mutate({
                                  id: user.id,
                                  password: passwordMap[user.id] ?? '',
                                })
                              }
                              className="rounded-xl bg-slate-900 px-3 py-2 text-white"
                            >
                              Actualizar
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
