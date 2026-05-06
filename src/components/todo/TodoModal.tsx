import { useState, useEffect, FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Todo, TodoInsert, Priority, Status } from '@/types';

interface TodoModalProps {
  open: boolean;
  todo?: Todo | null;
  onClose: () => void;
  onSave: (data: TodoInsert) => Promise<{ error: string | null }>;
}

const PRIORITIES: { value: Priority; label: string; selectedCls: string }[] = [
  { value: 'low',    label: 'Rendah', selectedCls: 'bg-[rgba(74,222,128,0.1)] border-green text-green' },
  { value: 'medium', label: 'Sedang', selectedCls: 'bg-[rgba(251,191,36,0.1)] border-yellow text-yellow' },
  { value: 'high',   label: 'Tinggi', selectedCls: 'bg-[rgba(248,113,113,0.1)] border-red text-red' },
];

const inputCls = "bg-bg border border-border rounded-sm text-text font-sans text-sm px-3.5 py-2.5 outline-none transition-all duration-[0.18s] w-full focus:border-accent focus:shadow-input";

export function TodoModal({ open, todo, onClose, onSave }: TodoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description ?? '');
      setPriority(todo.priority);
      setStatus(todo.status);
      setDueDate(todo.due_date ?? '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDueDate('');
    }
    setError(null);
  }, [todo, open]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Judul wajib diisi.'); return; }
    setSaving(true);
    setError(null);
    const { error } = await onSave({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      status,
      due_date: dueDate || null,
    });
    setSaving(false);
    if (error) { setError(error); return; }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-[4px] flex items-center justify-center z-[100] p-6 animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-bg-card border border-border-light rounded-2xl w-full max-w-[520px] shadow-card animate-slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold">{todo ? 'Edit Tugas' : 'Tugas Baru'}</h2>
          <button
            className="flex items-center justify-center w-8 h-8 bg-transparent border border-border rounded-lg text-text-muted cursor-pointer transition-all duration-[0.18s] hover:bg-bg hover:text-text hover:border-border-light"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted tracking-[0.02em]">
              Judul <span className="text-red">*</span>
            </label>
            <input
              type="text"
              placeholder="Apa yang perlu dilakukan?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted tracking-[0.02em]">Deskripsi</label>
            <textarea
              placeholder="Detail tambahan (opsional)..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className={`${inputCls} resize-y min-h-[80px]`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted tracking-[0.02em]">Prioritas</label>
              <div className="flex gap-1.5">
                {PRIORITIES.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    className={`flex-1 border rounded-[6px] font-sans text-xs font-medium py-[7px] cursor-pointer transition-all duration-[0.18s] text-center ${priority === p.value ? p.selectedCls : 'bg-transparent border-border text-text-muted hover:border-border-light hover:text-text'}`}
                    onClick={() => setPriority(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted tracking-[0.02em]">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as Status)}
                className={`${inputCls} select-arrow cursor-pointer`}
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted tracking-[0.02em]">Tenggat Waktu</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={inputCls}
            />
          </div>

          {error && (
            <p className="bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.3)] rounded-sm text-red text-[13px] px-3.5 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-2.5 justify-end mt-1">
            <button
              type="button"
              className="flex items-center gap-1.5 bg-transparent text-text-muted border border-border rounded-sm font-sans text-[13px] font-medium px-3.5 py-2 cursor-pointer transition-all duration-[0.18s] hover:text-text hover:border-border-light hover:bg-bg-card2"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-accent text-white border-none rounded-sm font-sans text-sm font-semibold px-5 py-[11px] cursor-pointer transition-all duration-[0.18s] hover:bg-accent-hover hover:shadow-accent hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
