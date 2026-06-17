import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPinned } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Panel } from '@/components/ui/Panel';
import { apiFetch } from '@/lib/api';
import type { UniversityRouteDto } from '@/types/api';

const initialRoute = {
  nombreRuta: '',
  descripcion: '',
};

export function RoutesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialRoute);
  const [editingId, setEditingId] = useState<string | null>(null);

  const routesQuery = useQuery({
    queryKey: ['routes'],
    queryFn: () => apiFetch<UniversityRouteDto[]>('/university-routes'),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      apiFetch(
        editingId ? `/university-routes/${editingId}` : '/university-routes',
        {
          method: editingId ? 'PATCH' : 'POST',
          body: JSON.stringify(form),
        },
      ),
    onSuccess: () => {
      setForm(initialRoute);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/university-routes/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });

  return (
    <div className="space-y-6">
      <Panel
        title="Rutas universitarias"
        subtitle="CRUD de recorridos y descripcion operativa"
        actions={
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            <MapPinned className="h-4 w-4" />
            Catalogo institucional
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <form
            className="space-y-4 rounded-[24px] bg-slate-50 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              saveMutation.mutate();
            }}
          >
            <h2 className="text-base font-semibold text-slate-900">
              {editingId ? 'Editar ruta' : 'Nueva ruta'}
            </h2>
            <input
              placeholder="Nombre de la ruta"
              value={form.nombreRuta}
              onChange={(event) => setForm((prev) => ({ ...prev, nombreRuta: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
            <textarea
              placeholder="Descripcion"
              value={form.descripcion}
              onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
              className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white"
              >
                {editingId ? 'Guardar cambios' : 'Crear ruta'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialRoute);
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>

          <div className="grid gap-4">
            {(routesQuery.data ?? []).length === 0 ? (
              <EmptyState
                title="No hay rutas registradas"
                description="Crea la primera ruta para poder asociarle encuestas."
              />
            ) : (
              routesQuery.data?.map((route) => (
                <article
                  key={route.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">{route.nombreRuta}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {route.descripcion || 'Sin descripcion'}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(route.id);
                          setForm({
                            nombreRuta: route.nombreRuta,
                            descripcion: route.descripcion ?? '',
                          });
                        }}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(route.id)}
                        className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
