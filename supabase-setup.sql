-- ============================================================
-- SUPABASE SETUP SCRIPT
-- Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================================

-- 1. Buat tabel todos
CREATE TABLE IF NOT EXISTS public.todos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status      TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  due_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Index untuk performa query per user
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS todos_status_idx ON public.todos(status);
CREATE INDEX IF NOT EXISTS todos_due_date_idx ON public.todos(due_date);

-- 3. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS todos_updated_at ON public.todos;
CREATE TRIGGER todos_updated_at
  BEFORE UPDATE ON public.todos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies — user hanya bisa akses data miliknya sendiri

-- SELECT: user hanya bisa lihat todos miliknya
CREATE POLICY "Users can view own todos"
  ON public.todos FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: user hanya bisa insert dengan user_id = dirinya sendiri
CREATE POLICY "Users can insert own todos"
  ON public.todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: user hanya bisa update todos miliknya
CREATE POLICY "Users can update own todos"
  ON public.todos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: user hanya bisa delete todos miliknya
CREATE POLICY "Users can delete own todos"
  ON public.todos FOR DELETE
  USING (auth.uid() = user_id);
