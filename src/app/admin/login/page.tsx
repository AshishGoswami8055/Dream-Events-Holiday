"use client";

import Link from "next/link";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { SITE_CONFIG } from "@/constants";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL_KEY = "deh-admin-email";
const ADMIN_REMEMBER_KEY = "deh-admin-remember";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const remember = watch("remember");

  useEffect(() => {
    const savedEmail = localStorage.getItem(ADMIN_EMAIL_KEY);
    const savedRemember = localStorage.getItem(ADMIN_REMEMBER_KEY) === "true";
    if (savedEmail) setValue("email", savedEmail);
    setValue("remember", savedRemember);
  }, [setValue]);

  const onSubmit = (data: LoginInput) => {
    if (data.remember) {
      localStorage.setItem(ADMIN_EMAIL_KEY, data.email);
      localStorage.setItem(ADMIN_REMEMBER_KEY, "true");
    } else {
      localStorage.removeItem(ADMIN_EMAIL_KEY);
      localStorage.removeItem(ADMIN_REMEMBER_KEY);
    }

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        remember: data.remember ? "true" : "false",
        redirect: false,
      });

      if (result?.error) {
        toast({ title: "Login Failed", description: "Invalid email or password", variant: "destructive" });
      } else {
        router.push("/admin");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="relative w-full max-w-md border border-white/10 bg-white shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex justify-center">
            <Logo href={null} height={80} variant="light" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>{SITE_CONFIG.name} — {SITE_CONFIG.tagline}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="on">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                {...register("email")}
                placeholder="admin@dreamevents.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-secondary/40 px-3 py-3">
              <input
                type="checkbox"
                className="mt-0.5 rounded"
                checked={!!remember}
                onChange={(e) => setValue("remember", e.target.checked, { shouldDirty: true })}
              />
              <span>
                <span className="block text-sm font-medium">Remember me</span>
                <span className="block text-xs text-muted-foreground">
                  Stay signed in for 30 days and save your email for next time. Your browser can also save the password.
                </span>
              </span>
            </label>

            <Button type="submit" className="w-full btn-glow" variant="accent" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In to Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
