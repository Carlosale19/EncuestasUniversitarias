import { BarChart3, Bus, ClipboardList, LogOut, Route, Users } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { cn } from '@/lib/utils';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
  { to: '/rutas', label: 'Rutas', icon: Route },
  { to: '/encuestas', label: 'Encuestas', icon: ClipboardList },
  { to: '/resultados', label: 'Resultados', icon: Bus },
];

export function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fecaca,transparent_45%),linear-gradient(180deg,#fff5f5_0%,#f8fafc_100%)]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[32px] bg-black px-6 py-7 text-slate-100 shadow-2xl">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-700/15 p-3 text-red-300">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Panel</p>
              <h1 className="font-semibold">Rutas Universitarias</h1>
            </div>
          </Link>

          <div className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                      isActive
                        ? 'bg-red-700 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          <div className="mt-10 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sesion</p>
            <p className="mt-3 text-sm font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-red-700/15"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </div>
        </aside>

        <main className="py-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
