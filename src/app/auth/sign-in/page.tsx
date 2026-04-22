'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/shared/FormInput';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginUser, clearError } from '@/redux/slices/authSlice';
import Link from 'next/link';
import { Sms, Lock1, ShieldTick, DocumentText, Activity } from 'iconsax-react';
import { motion } from 'framer-motion';
import { PageLoading } from '@/components/shared/PageLoading';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  // Decode the redirect param (URL to send user back to after login)
  const redirectTo = searchParams.get('redirect')
    ? decodeURIComponent(searchParams.get('redirect')!)
    : '/dashboard';

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  // Once authenticated, redirect to intended destination
  useEffect(() => {
    if (isAuthenticated) router.push(redirectTo);
  }, [isAuthenticated, router, redirectTo]);

  useEffect(() => {
    const sub = form.watch(() => { if (error) dispatch(clearError()); });
    return () => sub.unsubscribe();
  }, [form, error, dispatch]);

  const onSubmit = (values: FormValues) => {
    dispatch(loginUser(values));
  };

  return (
    <div className="relative min-h-screen flex items-stretch overflow-hidden bg-background">
      {/* LEFT PANEL — Brand/Visual */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-foreground text-background flex-col justify-between p-12 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Top nav */}
        <div className="relative z-10 flex items-center gap-3">
          <ShieldTick size={28} variant="Bulk" color="currentColor" className="opacity-80" />
          <span className="font-bold text-xl tracking-tight">AQSAMS</span>
        </div>

        {/* Mid content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-mono opacity-40 tracking-widest">● ICAO_ANNEX_19_COMPLIANT</div>
            <h2 className="text-4xl font-bold leading-tight">
              Aviation Safety<br />
              <span className="italic opacity-70">Oversight Platform.</span>
            </h2>
            <p className="text-sm opacity-50 leading-relaxed max-w-xs">
              Enterprise-grade digitalization for aviation audits. Built for strict compliance with NCAA Advisory Circulars and International Standards.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: DocumentText, label: 'E-Checklists' },
              { icon: ShieldTick, label: 'SMS Ready' },
              { icon: Activity, label: 'Safety KPIs' },
              { icon: DocumentText, label: 'Audit Reports' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 opacity-60">
                <Icon size={14} variant="Bulk" color="currentColor" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-[10px] font-mono opacity-30 tracking-widest">
          AQSAMS_V2 // NCAA / ICAO / IATA
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'circOut' }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Access Terminal</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your AQSAMS account to continue.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="auditor@airline.ng"
                loading={isLoading}
                icon={<Sms size={18} variant="Outline" color="currentColor" />}
              />
              <FormInput
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                loading={isLoading}
                icon={<Lock1 size={18} variant="Outline" color="currentColor" />}
              />

              {/* Server Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3"
                >
                  <div className="mt-0.5 h-4 w-4 rounded-full bg-destructive/20 flex-shrink-0 flex items-center justify-center">
                    <span className="text-destructive text-[10px] font-bold">!</span>
                  </div>
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 font-bold rounded-lg shadow-lg shadow-foreground/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Authenticating…
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="font-semibold text-foreground hover:underline underline-offset-4">
              Create account
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground/50 font-mono">
            ● SECURE CONNECTION // TLS_1.3
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<PageLoading message="Preparing Terminal..." />}>
      <SignInForm />
    </Suspense>
  );
}
