"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, MailCheck, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { verifyEmailSchema, type VerifyEmailValues } from "@/lib/validations/auth";
import { useVerifyEmail } from "@/hooks/auth/use-verify-email";
import { useResendCode } from "@/hooks/auth/use-resend-code";

const RESEND_COOLDOWN = 60;

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendCode();

  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email, code: "" },
  });

  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = useCallback(() => {
    if (cooldown > 0 || !email) return;
    resendMutation.mutate(
      { email },
      {
        onSuccess: () => setCooldown(RESEND_COOLDOWN),
      },
    );
  }, [cooldown, email, resendMutation]);

  const onSubmit = (values: VerifyEmailValues) => {
    verifyMutation.mutate(values);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
        >
          <MailCheck className="h-7 w-7 text-primary" />
        </motion.div>
        <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="verify-email-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <input type="hidden" {...form.register("email")} />

            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="verify-code">Verification code</FieldLabel>
                  <Input
                    {...field}
                    id="verify-code"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                    className="text-center text-lg tracking-[0.5em]"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <MailCheck />
              )}
              Verify email
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          {cooldown > 0 ? (
            <span className="font-medium text-muted-foreground">
              Resend in {formatTime(cooldown)}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
            >
              {resendMutation.isPending ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Sending...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" /> Resend code
                </span>
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
