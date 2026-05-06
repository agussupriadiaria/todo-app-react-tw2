export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in_progress' | 'done';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type TodoInsert = Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type TodoUpdate = Partial<TodoInsert>;

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: Todo;
        Insert: TodoInsert & { user_id: string };
        Update: TodoUpdate;
      };
    };
  };
}
