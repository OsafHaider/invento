"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import FormInput from "@/components/form-input";
import { authAPI } from "@/lib/auth-api";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

// ---------------- Schema ----------------
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email").trim(),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInForm) => {
    try {
      const result = await authAPI.signIn(data);

      setUser(result.user);
      setIsAuthenticated(true);

      toast.success("Logged in successfully");
      router.push("/profile");
    } catch (error: unknown) {
      // Generic error handling
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";

      setError("root", { message });
      toast.error(message);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Root Error */}
          {errors.root && (
            <div className="text-sm text-red-500">{errors.root.message}</div>
          )}

          <FormInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          <FormInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
            error={errors.password?.message}
            disabled={isSubmitting}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
}
