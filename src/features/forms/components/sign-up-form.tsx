import {
  RiArrowRightLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiMailLine,
  RiUserLine,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/shared/components";

interface SignUpFormProps {
  role: "user" | "provider";
  onSubmit: (data: {
    name: string;
    email: string;
    password?: string;
    role: "user" | "provider";
  }) => void;
  isLoading?: boolean;
  serverError?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  role,
  onSubmit,
  isLoading = false,
  serverError,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
      setPasswordError(null);
      onSubmit({
        name: value.name,
        email: value.email,
        password: value.password,
        role,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="w-full space-y-6"
    >
      {(serverError || passwordError) && (
        <Alert
          variant="destructive"
          className="rounded-none border-destructive/20 bg-destructive/5"
        >
          <AlertDescription className="font-bold uppercase tracking-widest text-[10px]">
            {serverError || passwordError}
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-4">
        <form.Field name="name">
          {(field) => (
            <FormField label="Full Name" required>
              <div className="relative group">
                <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="text"
                  className="pl-12 h-14 bg-muted/10 border-border/40 focus:border-primary/40 rounded-none transition-all text-sm shadow-none focus:ring-0"
                  placeholder="John Doe"
                  required
                />
              </div>
            </FormField>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <FormField label="Email Address" required>
              <div className="relative group">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  className="pl-12 h-14 bg-muted/10 border-border/40 focus:border-primary/40 rounded-none transition-all text-sm shadow-none focus:ring-0"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </FormField>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <FormField label="Password" required>
              <div className="relative group">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  type={showPassword ? "text" : "password"}
                  className="pl-12 h-14 bg-muted/10 border-border/40 focus:border-primary/40 rounded-none transition-all text-sm shadow-none focus:ring-0"
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <RiEyeOffLine className="w-5 h-5" />
                  ) : (
                    <RiEyeLine className="w-5 h-5" />
                  )}
                </button>
              </div>
            </FormField>
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
            <FormField label="Confirm Password" required>
              <div className="relative group">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-12 h-14 bg-muted/10 border-border/40 focus:border-primary/40 rounded-none transition-all text-sm shadow-none focus:ring-0"
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <RiEyeOffLine className="w-5 h-5" />
                  ) : (
                    <RiEyeLine className="w-5 h-5" />
                  )}
                </button>
              </div>
            </FormField>
          )}
        </form.Field>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] rounded-none border-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
        {!isLoading && <RiArrowRightLine className="ml-2 w-5 h-5" />}
      </Button>
    </form>
  );
};
