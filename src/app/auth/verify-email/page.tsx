'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sms, ShieldTick, DocumentText, Activity, Key } from 'iconsax-react';
import { motion } from 'framer-motion';
import { PageLoading } from '@/components/shared/PageLoading';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/shared/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authClient } from '@/lib/auth/client';
import { toast } from 'sonner';

const otpSchema = z.object({
  otp: z.string().min(1, 'Verification code is required'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Email is required for verification.");
      router.push('/auth/sign-in');
    }
  }, [email, router]);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address is required to resend verification code.");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (error) {
        toast.error(error.message || "Failed to resend verification code.");
      } else {
        toast.success("A new verification code has been sent to your email!");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to send verification code.");
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (values: OtpFormValues) => {
    if (!email) return;

    setIsVerifying(true);
    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: values.otp,
      });

      if (error) {
        toast.error(error.message || "Invalid verification code.");
      } else {
        toast.success("Account verified successfully! You can now log in.");
        router.push('/auth/sign-in');
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("An unexpected error occurred during email verification.");
    } finally {
      setIsVerifying(false);
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

      {/* RIGHT PANEL — Verification Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'circOut' }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Sms size={28} variant="Bold" color="currentColor" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Verify Your Email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a verification code to <span className="font-semibold text-foreground">{email || "your email address"}</span>.
              </p>
              <p className="text-sm text-muted-foreground">
                Please enter the verification code sent to your email to verify and activate your account.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormInput
                name="otp"
                label="Verification Code"
                type="text"
                placeholder="Enter verification code"
                loading={isVerifying}
                icon={<Key size={18} variant="Outline" color="currentColor" />}
              />

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  disabled={isVerifying || !email}
                  size="lg"
                  className="w-full h-12 font-bold rounded-lg shadow-lg"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={isResending || !email}
                  size="lg"
                  className="w-full h-12 font-bold rounded-lg cursor-pointer"
                >
                  {isResending ? 'Resending Code…' : 'Resend Verification Code'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/auth/sign-in')}
                  size="lg"
                  className="w-full h-12 font-bold rounded-lg cursor-pointer"
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageLoading message="Preparing Verification Page..." />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
