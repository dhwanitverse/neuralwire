'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 z-[201] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="nw-glass overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-violet-500/10">
              <div className="flex items-start justify-between border-b border-white/8 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{title}</h3>
                </div>
                <button onClick={onCancel} className="text-slate-500 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="p-5 text-sm leading-relaxed text-slate-400">{message}</p>
              <div className="flex gap-3 border-t border-white/8 p-5">
                <button onClick={onCancel} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5">
                  Cancel
                </button>
                <Button onClick={onConfirm} loading={loading} className="flex-1 !bg-red-600 hover:!bg-red-500">
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
