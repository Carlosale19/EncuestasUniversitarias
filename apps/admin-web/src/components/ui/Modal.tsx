import type { PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
}>;

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
