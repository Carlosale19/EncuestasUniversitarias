import {
  BarChart3,
  Bus,
  ClipboardList,
  LogOut,
  Menu,
  Route,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900">
      {/* Franja roja institucional Unisinú */}
      <div className="h-1.5 w-full bg-unisinu-red" />

      {/* Header móvil para pantallas pequeñas */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src="/unisinu-escudo.png"
            alt="Unisinú"
            className="h-9 w-9 object-contain"
          />
          <div>
            <span className="block text-xs font-bold leading-tight tracking-tight text-unisinu-red">
              UNISINÚ
            </span>
            <span className="block text-[11px] font-medium leading-tight text-slate-500">
              Rutas y Encuestas
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          aria-label="Menú principal"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Contenedor principal con grid responsive */}
      <div className="mx-auto flex max-w-[1600px] flex-col lg:grid lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-6 lg:p-6">
        {/* Overlay móvil cuando el menú está abierto */}
        {mobileMenuOpen ? (
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        ) : null}

        {/* Sidebar desktop y drawer móvil */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between bg-[#1a202c] p-6 text-slate-100 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:h-[calc(100vh-3rem)] lg:w-full lg:rounded-3xl lg:translate-x-0',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          )}
        >
          <div>
            {/* Header del sidebar con logo Unisinú */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-start gap-1"
              >
                <img
                  src="/logo-unisinu-blanco.png"
                  alt="Universidad del Sinú Seccional Cartagena"
                  className="h-10 w-auto object-contain"
                />
                <span className="mt-1 text-[10px] font-semibold tracking-wider text-[#ffb606] uppercase">
                  Seccional Cartagena · Movilidad
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menú de navegación */}
            <nav className="mt-6 space-y-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition',
                        isActive
                          ? 'bg-[#e42313] text-white shadow-md shadow-red-900/30 font-semibold'
                          : 'text-slate-200 hover:bg-white/10 hover:text-white',
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0 transition group-hover:scale-110" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Tarjeta de sesión de usuario en la base del sidebar */}
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e42313] text-xs font-bold text-white shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{user?.name}</p>
                <p className="truncate text-[11px] text-slate-300">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-[#e42313] hover:text-white hover:border-transparent"
            >
              <LogOut className="h-3.5 w-3.5" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Área de contenido principal con padding responsive */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
