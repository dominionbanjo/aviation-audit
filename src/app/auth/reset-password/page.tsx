'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/shared/FormInput';
import { Button } from '@/components/ui/button';
import { Lock1, ShieldTick, DocumentText, Activity } from 'iconsax-react';
import { motion } from 'framer-motion';
import { PageLoading } from '@/components/shared/PageLoading';
import { authClient } from '@/lib/auth/client';
import { toast } from 'sonner';

const schema = z.object({
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isResetting, setIsResetting] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing password reset token.");
      router.push('/auth/sign-in');
    }
  }, [token, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      toast.error("Missing password reset token.");
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.newPassword,
        token: token,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password.");
      } else {
        toast.success("Password reset successfully! Please sign in with your new credentials.");
        router.push('/auth/sign-in');
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("An unexpected error occurred during password reset.");
    } finally {
      setIsResetting(false);
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              Please enter and confirm your new password below.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormInput
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="••••••••"
                loading={isResetting}
                icon={<Lock1 size={18} variant="Outline" color="currentColor" />}
              />
              <FormInput
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                loading={isResetting}
                icon={<Lock1 size={18} variant="Outline" color="currentColor" />}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 font-bold rounded-lg shadow-lg shadow-foreground/10"
                disabled={isResetting || !token}
              >
                {isResetting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Resetting Password…
                  </span>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoading message="Preparing Reset Page..." />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
