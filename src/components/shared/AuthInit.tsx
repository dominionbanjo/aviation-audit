'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { fetchProfile } from '@/redux/slices/authSlice';

/**
 * AuthInit silently restores the user session on page load
 * by hitting the /api/user/profile route (which reads the session cookie).
 * Renders nothing — purely behavioural.
 */
export function AuthInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return null;
}
