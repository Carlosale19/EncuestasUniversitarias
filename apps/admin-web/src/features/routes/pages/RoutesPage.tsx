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
        title="Rutas Universitarias"
        subtitle="Administración de recorridos y paradas institucionales"
        actions={
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-unisinu-red">
            <MapPinned className="h-3.5 w-3.5" />
            Catálogo Unisinú
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* Formulario */}
          <form
            className="space-y-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              saveMutation.mutate();
            }}
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {editingId ? 'Editar Ruta Institucional' : 'Nueva Ruta Institucional'}
            </h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Nombre de la Ruta *</label>
              <input
                required
                placeholder="Ej. Ruta Campus Santillana - Centro"
                value={form.nombreRuta}
                onChange={(event) => setForm((prev) => ({ ...prev, nombreRuta: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Descripción o Itinerario</label>
              <textarea
                placeholder="Horarios, puntos de recogida y paradas principales..."
                value={form.descripcion}
                onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
                className="mt-1.5 min-h-28 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              />
            </div>
            {saveMutation.error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-unisinu-red">
                {saveMutation.error.message}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 rounded-xl bg-unisinu-red px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-unisinu-red-hover disabled:opacity-60"
              >
                {saveMutation.isPending ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Crear Ruta'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialRoute);
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>

          {/* Listado de rutas */}
          <div className="space-y-3">
            {deleteMutation.error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-unisinu-red">
                {deleteMutation.error.message}
              </div>
            ) : null}
            {routesQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : (routesQuery.data ?? []).length === 0 ? (
              <EmptyState
                title="No hay rutas registradas"
                description="Crea la primera ruta universitaria para vincular encuestas de movilidad."
              />
            ) : (
              routesQuery.data?.map((route) => (
                <article
                  key={route.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-md hover:shadow-red-950/5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-unisinu-red transition">
                        {route.nombreRuta}
                      </h2>
                      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {route.descripcion || 'Sin descripción detallada registrada.'}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(route.id);
                          setForm({
                            nombreRuta: route.nombreRuta,
                            descripcion: route.descripcion ?? '',
                          });
                        }}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`¿Estás seguro de eliminar la ruta "${route.nombreRuta}"?`)) {
                            deleteMutation.mutate(route.id);
                          }
                        }}
                        className="rounded-xl border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-unisinu-red transition hover:bg-unisinu-red hover:text-white"
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
