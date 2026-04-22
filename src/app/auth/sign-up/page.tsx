'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/shared/FormInput';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { signUpUser, clearError } from '@/redux/slices/authSlice';
import { useEffect } from 'react';
import Link from 'next/link';
import { Sms, Lock1, Profile, ShieldTick, Award, Global, Task } from 'iconsax-react';
import { motion } from 'framer-motion';

const schema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  useEffect(() => {
    const sub = form.watch(() => { if (error) dispatch(clearError()); });
    return () => sub.unsubscribe();
  }, [form, error, dispatch]);

  const onSubmit = (values: FormValues) => {
    dispatch(signUpUser(values));
  };

  return (
    <div className="relative min-h-screen flex items-stretch overflow-hidden bg-background">
      {/* LEFT PANEL — Brand/Visual */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-foreground text-background flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex items-center gap-3">
          <ShieldTick size={28} variant="Bulk" color="currentColor" className="opacity-80" />
          <span className="font-bold text-xl tracking-tight">AQSAMS</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-mono opacity-40 tracking-widest">● ONBOARDING</div>
            <h2 className="text-4xl font-bold leading-tight">
              Join Aviation<br />
              <span className="italic opacity-70">Safety Oversight.</span>
            </h2>
            <p className="text-sm opacity-50 leading-relaxed max-w-xs">
              Get access to Nigeria's most advanced aviation audit management system. Track compliance, manage findings, and generate regulatory reports.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Award, label: 'NCAA Advisory Circular Compliance' },
              { icon: Global, label: 'ICAO / IATA Standard Templates' },
              { icon: Task, label: 'Real-time Finding Tracker' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 opacity-60">
                <div className="h-8 w-8 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} variant="Bulk" color="currentColor" />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

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
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-sm text-muted-foreground">
              Register to access the AQSAMS platform.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormInput
                name="name"
                label="Full Name"
                placeholder="John Akinniran"
                loading={isLoading}
                icon={<Profile size={18} variant="Outline" color="currentColor" />}
              />
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
                placeholder="Min. 6 characters"
                loading={isLoading}
                icon={<Lock1 size={18} variant="Outline" color="currentColor" />}
              />

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
                    Creating account…
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="font-semibold text-foreground hover:underline underline-offset-4">
              Sign in
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
