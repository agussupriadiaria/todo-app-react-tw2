import { useState } from 'react';
import { Pencil, Trash2, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import type { Todo, Status } from '@/types';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: Status) => Promise<void>;
}

const STATUS_FLOW: Record<Status, { next: Status | null; label: string; nextLabel: string | null }> = {
  todo: { next: 'in_progress', label: 'Todo', nextLabel: 'Mulai' },
  in_progress: { next: 'done', label: 'In Progress', nextLabel: 'Selesai' },
  done: { next: null, label: 'Done', nextLabel: null },
};

const PRIORITY_CONFIG = {
  low:    { label: 'Rendah', cls: 'bg-[rgba(74,222,128,0.1)] text-green border border-[rgba(74,222,128,0.2)]' },
  medium: { label: 'Sedang', cls: 'bg-[rgba(251,191,36,0.1)] text-yellow border border-[rgba(251,191,36,0.2)]' },
  high:   { label: 'Tinggi', cls: 'bg-[rgba(248,113,113,0.1)] text-red border border-[rgba(248,113,113,0.2)]' },
};

const STATUS_BADGE_CLS: Record<Status, string> = {
  todo:        'bg-[rgba(100,100,120,0.15)] text-text-dim border border-border',
  in_progress: 'bg-[rgba(251,191,36,0.1)] text-yellow border border-[rgba(251,191,36,0.2)]',
  done:        'bg-[rgba(74,222,128,0.1)] text-green border border-[rgba(74,222,128,0.2)]',
};

export function TodoCard({ todo, onEdit, onDelete, onStatusChange }: TodoCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const statusInfo = STATUS_FLOW[todo.status];
  const priorityInfo = PRIORITY_CONFIG[todo.priority];
  const isOverdue = todo.due_date && todo.status !== 'done' && isPast(parseISO(todo.due_date));

  const handleDelete = async () => {
    if (!confirm('Hapus tugas ini?')) return;
    setDeleting(true);
    await onDelete(todo.id);
    setDeleting(false);
  };

  const handleAdvance = async () => {
    if (!statusInfo.next) return;
    setAdvancing(true);
    await onStatusChange(todo.id, statusInfo.next);
    setAdvancing(false);
  };

  return (
    <div className={`bg-bg-card2 border rounded-sm p-3.5 transition-all duration-[0.18s] hover:border-border-light hover:shadow-[0_2px_12px_rgba(0,0,0,0.3)] ${isOverdue ? 'border-[rgba(248,113,113,0.3)]' : 'border-border'} ${todo.status === 'done' ? 'opacity-65' : ''}`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex gap-1.5 flex-wrap">
          <span className={`text-[10px] font-semibold tracking-[0.04em] uppercase px-2 py-0.5 rounded ${priorityInfo.cls}`}>
            {priorityInfo.label}
          </span>
          <span className={`text-[10px] font-semibold tracking-[0.04em] uppercase px-2 py-0.5 rounded ${STATUS_BADGE_CLS[todo.status]}`}>
            {statusInfo.label}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            className="flex items-center justify-center w-7 h-7 bg-transparent border border-transparent rounded-[6px] text-text-dim cursor-pointer transition-all duration-[0.18s] hover:bg-bg hover:border-border hover:text-text"
            onClick={() => onEdit(todo)}
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            className="flex items-center justify-center w-7 h-7 bg-transparent border border-transparent rounded-[6px] text-text-dim cursor-pointer transition-all duration-[0.18s] hover:bg-[rgba(248,113,113,0.1)] hover:border-[rgba(248,113,113,0.3)] hover:text-red disabled:opacity-50"
            onClick={handleDelete}
            disabled={deleting}
            title="Hapus"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>
      </div>

      <h3 className={`text-[13px] font-semibold leading-snug text-text mb-1.5 break-words ${todo.status === 'done' ? 'line-through text-text-muted' : ''}`}>
        {todo.title}
      </h3>

      {todo.description && (
        <p className="text-xs text-text-muted leading-relaxed mb-2.5 break-words line-clamp-2">
          {todo.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-2.5 flex-wrap gap-2">
        {todo.due_date && (
          <span className={`flex items-center gap-1 text-[11px] font-mono ${isOverdue ? 'text-red' : 'text-text-muted'}`}>
            <Calendar size={12} />
            {format(parseISO(todo.due_date), 'd MMM yyyy', { locale: id })}
            {isOverdue && ' · Terlambat'}
          </span>
        )}
        {statusInfo.next && (
          <button
            className="flex items-center gap-1 bg-[rgba(108,141,250,0.2)] border border-[rgba(108,141,250,0.3)] rounded-[20px] text-accent font-sans text-[11px] font-semibold px-2.5 py-1 cursor-pointer transition-all duration-[0.18s] hover:bg-accent hover:text-white hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAdvance}
            disabled={advancing}
          >
            {advancing
              ? <Loader2 size={12} className="animate-spin" />
              : <><ChevronRight size={12} />{statusInfo.nextLabel}</>
            }
          </button>
        )}
      </div>
    </div>
  );
}
