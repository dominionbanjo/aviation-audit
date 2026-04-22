export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
