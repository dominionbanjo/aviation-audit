import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types/auth';

// ─── Async Thunks ──────────────────────────────────────────────────────────────
// 
// ARCHITECTURE: Auth thunks go directly to the Neon Auth proxy handler at
// /api/auth/[...path] (which uses authApiHandler()). Browser fetch calls
// include the Origin header automatically — avoiding CORS/CSRF rejections.
// Custom routes that do server-to-server calls were removed for this reason.

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  // Goes through authApiHandler proxy → Neon Auth backend
  const res = await fetch('/api/auth/sign-in/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, callbackURL: '/dashboard' }),
  });

  const data = await res.json() as { user?: User; error?: string; message?: string };

  if (!res.ok) {
    return rejectWithValue(
      (data as { message?: string }).message || (data as { error?: string }).error || 'Login failed'
    );
  }

  if (!data.user) {
    // Fetch profile to get user since some auth responses only return session
    const profileRes = await fetch('/api/user/profile');
    const profileData = await profileRes.json() as { user?: User; error?: string };
    if (!profileRes.ok) return rejectWithValue('Login succeeded but profile fetch failed');
    return profileData.user as User;
  }

  return data.user;
});

export const signUpUser = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/signUp', async (payload, { rejectWithValue }) => {
  // Goes through authApiHandler proxy → Neon Auth backend
  const res = await fetch('/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, callbackURL: '/dashboard' }),
  });

  const data = await res.json() as { user?: User; error?: string; message?: string };

  if (!res.ok) {
    return rejectWithValue(
      (data as { message?: string }).message || (data as { error?: string }).error || 'Sign up failed'
    );
  }

  if (!data.user) {
    const profileRes = await fetch('/api/user/profile');
    const profileData = await profileRes.json() as { user?: User; error?: string };
    if (!profileRes.ok) return rejectWithValue('Sign up succeeded but profile fetch failed');
    return profileData.user as User;
  }

  return data.user;
});

export const fetchProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/fetchProfile', async (_, { rejectWithValue }) => {
  const res = await fetch('/api/user/profile');
  const data = await res.json() as { user?: User; error?: string };
  if (!res.ok) return rejectWithValue((data as { error?: string }).error || 'Failed to fetch profile');
  return data.user as User;
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  // The Neon Auth proxy handler requires Content-Type: application/json
  await fetch('/api/auth/sign-out', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
});

// ─── Slice ─────────────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Login failed';
      });

    // Sign Up
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Sign up failed';
      });

    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
