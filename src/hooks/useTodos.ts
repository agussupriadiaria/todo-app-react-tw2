import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Todo, TodoInsert, TodoUpdate } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTodos((data ?? []) as Todo[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = async (todo: TodoInsert): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('todos')
      .insert([{ ...todo, user_id: user.id }] as never);
    if (error) return { error: error.message };
    await fetchTodos();
    return { error: null };
  };

  const updateTodo = async (id: string, updates: TodoUpdate): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from('todos')
      .update(updates as never)
      .eq('id', id);
    if (error) return { error: error.message };
    await fetchTodos();
    return { error: null };
  };

  const deleteTodo = async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    if (error) return { error: error.message };
    setTodos(prev => prev.filter(t => t.id !== id));
    return { error: null };
  };

  return { todos, loading, error, createTodo, updateTodo, deleteTodo, refetch: fetchTodos };
}
