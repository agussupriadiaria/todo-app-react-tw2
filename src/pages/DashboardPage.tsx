import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, LogOut, CheckSquare, Search, SlidersHorizontal, Loader2, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTodos } from '@/hooks/useTodos';
import { TodoCard } from '@/components/todo/TodoCard';
import { TodoModal } from '@/components/todo/TodoModal';
import type { Todo, TodoInsert, Status, Priority } from '@/types';

type FilterStatus = 'all' | Status;
type FilterPriority = 'all' | Priority;
type SortBy = 'created_at' | 'due_date' | 'priority';

const STATUS_COLUMNS: { key: Status; label: string; emoji: string }[] = [
  { key: 'todo', label: 'Todo', emoji: '📋' },
  { key: 'in_progress', label: 'In Progress', emoji: '🔄' },
  { key: 'done', label: 'Done', emoji: '✅' },
];

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

const colBorderTop: Record<Status, string> = {
  todo: 'border-t-[3px] border-t-text-dim',
  in_progress: 'border-t-[3px] border-t-yellow',
  done: 'border-t-[3px] border-t-green',
};

const statBorderLeft: Record<Status, string> = {
  todo: 'border-l-[3px] border-l-text-dim',
  in_progress: 'border-l-[3px] border-l-yellow',
  done: 'border-l-[3px] border-l-green',
};

export function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { todos, loading, createTodo, updateTodo, deleteTodo } = useTodos();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [sortBy, setSortBy] = useState<SortBy>('created_at');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return todos
      .filter(t => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.description ?? '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || t.status === filterStatus;
        const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
        return matchSearch && matchStatus && matchPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        if (sortBy === 'due_date') {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return a.due_date.localeCompare(b.due_date);
        }
        return b.created_at.localeCompare(a.created_at);
      });
  }, [todos, search, filterStatus, filterPriority, sortBy]);

  if (authLoading) return (
    <div className="h-screen flex items-center justify-center text-accent">
      <Loader2 className="animate-spin" size={32} />
    </div>
  );
  if (!user) return <Navigate to="/" replace />;

  const countByStatus = (status: Status) => filtered.filter(t => t.status === status).length;

  const handleSave = async (data: TodoInsert) => {
    if (editTodo) return updateTodo(editTodo.id, data);
    return createTodo(data);
  };

  const openCreate = () => { setEditTodo(null); setModalOpen(true); };
  const openEdit = (todo: Todo) => { setEditTodo(todo); setModalOpen(true); };

  return (
    <div className="min-h-screen flex flex-col max-w-[1400px] mx-auto px-6 pb-10">
      {/* Header */}
      <header className="flex items-center justify-between py-5 border-b border-border mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-accent text-lg font-bold tracking-tight">
            <CheckSquare size={22} />
            <span>Taskly</span>
          </div>
          <p className="text-text-muted text-[13px]">Halo, {user.email?.split('@')[0]} 👋</p>
        </div>
        <button
          className="flex items-center gap-1.5 bg-transparent text-red border border-[rgba(248,113,113,0.3)] rounded-sm font-sans text-[13px] font-medium px-3.5 py-2 cursor-pointer transition-all duration-[0.18s] hover:bg-[rgba(248,113,113,0.1)] hover:border-red"
          onClick={signOut}
        >
          <LogOut size={16} /> Keluar
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {STATUS_COLUMNS.map(col => (
          <div key={col.key} className={`bg-bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-3.5 ${statBorderLeft[col.key]}`}>
            <span className="text-2xl">{col.emoji}</span>
            <div>
              <p className="text-2xl font-bold leading-none font-mono">{todos.filter(t => t.status === col.key).length}</p>
              <p className="text-xs text-text-muted mt-0.5">{col.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2.5 items-center mb-3 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center gap-2.5 bg-bg-card border border-border rounded-sm px-3.5 py-2 text-text-muted">
          <Search size={16} />
          <input
            type="text"
            placeholder="Cari tugas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-text font-sans text-sm flex-1 placeholder:text-text-dim"
          />
        </div>
        <button
          className={`flex items-center gap-1.5 bg-transparent border border-border rounded-sm font-sans text-[13px] font-medium px-3.5 py-2 cursor-pointer transition-all duration-[0.18s] hover:text-text hover:border-border-light hover:bg-bg-card2 ${showFilters ? 'text-accent border-accent bg-[rgba(108,141,250,0.2)]' : 'text-text-muted'}`}
          onClick={() => setShowFilters(s => !s)}
        >
          <SlidersHorizontal size={16} /> Filter
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-accent text-white border-none rounded-sm font-sans text-sm font-semibold px-5 py-[11px] cursor-pointer transition-all duration-[0.18s] hover:bg-accent-hover hover:shadow-accent hover:-translate-y-px"
          onClick={openCreate}
        >
          <Plus size={16} /> Tugas Baru
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-4 flex-wrap bg-bg-card border border-border rounded-xl px-4 py-3.5 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted font-medium whitespace-nowrap">Status:</span>
            {(['all', 'todo', 'in_progress', 'done'] as FilterStatus[]).map(s => (
              <button
                key={s}
                className={`bg-transparent border rounded-[20px] font-sans text-xs px-3 py-1 cursor-pointer transition-all duration-[0.18s] ${filterStatus === s ? 'bg-[rgba(108,141,250,0.2)] border-accent text-accent font-medium' : 'border-border text-text-muted hover:border-border-light hover:text-text'}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === 'all' ? 'Semua' : s === 'in_progress' ? 'In Progress' : s === 'todo' ? 'Todo' : 'Done'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted font-medium whitespace-nowrap">Prioritas:</span>
            {(['all', 'high', 'medium', 'low'] as FilterPriority[]).map(p => (
              <button
                key={p}
                className={`bg-transparent border rounded-[20px] font-sans text-xs px-3 py-1 cursor-pointer transition-all duration-[0.18s] ${filterPriority === p ? 'bg-[rgba(108,141,250,0.2)] border-accent text-accent font-medium' : 'border-border text-text-muted hover:border-border-light hover:text-text'}`}
                onClick={() => setFilterPriority(p)}
              >
                {p === 'all' ? 'Semua' : p === 'high' ? 'Tinggi' : p === 'medium' ? 'Sedang' : 'Rendah'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted font-medium whitespace-nowrap">Urutkan:</span>
            {([['created_at', 'Terbaru'], ['due_date', 'Deadline'], ['priority', 'Prioritas']] as [SortBy, string][]).map(([val, lbl]) => (
              <button
                key={val}
                className={`bg-transparent border rounded-[20px] font-sans text-xs px-3 py-1 cursor-pointer transition-all duration-[0.18s] ${sortBy === val ? 'bg-[rgba(108,141,250,0.2)] border-accent text-accent font-medium' : 'border-border text-text-muted hover:border-border-light hover:text-text'}`}
                onClick={() => setSortBy(val)}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Kanban */}
      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-text-muted">
          <Loader2 className="animate-spin" size={28} /> Memuat tugas...
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 flex-1 items-start max-[900px]:grid-cols-1">
          {STATUS_COLUMNS.map(col => (
            <div key={col.key} className={`bg-bg-card border border-border rounded-xl overflow-hidden ${colBorderTop[col.key]}`}>
              <div className="flex items-center justify-between px-4 py-3.5 text-[13px] font-semibold border-b border-border">
                <span>{col.emoji} {col.label}</span>
                <span className="bg-bg border border-border rounded-[20px] text-[11px] font-mono px-2 py-0.5 text-text-muted">
                  {countByStatus(col.key)}
                </span>
              </div>
              <div className="p-3 flex flex-col gap-2.5 min-h-[80px]">
                {filtered.filter(t => t.status === col.key).length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-text-dim text-xs">
                    <ClipboardList size={24} />
                    <p>Tidak ada tugas</p>
                  </div>
                ) : (
                  filtered
                    .filter(t => t.status === col.key)
                    .map(todo => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onEdit={openEdit}
                        onDelete={async (id) => { await deleteTodo(id); }}
                        onStatusChange={async (id, status) => { await updateTodo(id, { status }); }}
                      />
                    ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <TodoModal
        open={modalOpen}
        todo={editTodo}
        onClose={() => { setModalOpen(false); setEditTodo(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
