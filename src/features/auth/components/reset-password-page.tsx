import {
  RiArrowLeftLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";
import { useResetPasswordMutation } from "@/services/api/auth";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { token?: string };
  const token = search.token;
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
    onSubmit: async ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      if (!token) {
        toast.error("Invalid or missing reset token.");
        return;
      }
      try {
        await resetPassword({ token, newPassword: value.newPassword }).unwrap();
        toast.success("Password reset successfully!");
        navigate({ to: "/auth/signin", replace: true });
      } catch {
        toast.error("Failed to reset password. The link may have expired.");
      }
    },
  });

  if (!token) {
    return (
      <>
        <Link
          to="/auth/forgot-password"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <RiArrowLeftLine className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-heading font-bold uppercase tracking-wider">
            Request new link
          </span>
        </Link>
        <p className="text-sm text-muted-foreground">
          This reset link is invalid or has expired. Please request a new one.
        </p>
      </>
    );
  }

  return (
    <>
      <Link
        to="/auth/signin"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <RiArrowLeftLine className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-heading font-bold uppercase tracking-wider">
          Back to Sign In
        </span>
      </Link>

      <div className="mb-10">
        <h2 className="text-3xl font-heading font-bold uppercase mb-2 text-foreground">
          Reset Password
        </h2>
        <p className="text-muted-foreground">Enter your new password below.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="w-full space-y-6"
      >
        <form.Field name="newPassword">
          {(field) => (
            <FormField label="New Password" required>
              <div className="relative">
                <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 h-12 shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? (
                    <RiEyeOffLine className="w-4 h-4" />
                  ) : (
                    <RiEyeLine className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
            <FormField label="Confirm Password" required>
              <div className="relative">
                <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 h-12 shadow-none rounded-none border-border/40 focus:border-primary/40 focus:ring-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? (
                    <RiEyeOffLine className="w-4 h-4" />
                  ) : (
                    <RiEyeLine className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>
          )}
        </form.Field>

        <Button
          type="submit"
          className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 border-none rounded-none"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </>
  );
}
