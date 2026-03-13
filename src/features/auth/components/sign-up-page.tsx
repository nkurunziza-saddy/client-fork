import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiMailLine,
  RiStoreLine,
} from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "@/features/forms/components/sign-up-form";
import { getErrorFromRtkQuery } from "@/lib/utils";
import { useSignUpMutation } from "@/services/api/auth";

export function SignUpPage() {
  const [signUp, { isLoading, error }] = useSignUpMutation();

  const [step, setStep] = useState<"role" | "details" | "success">("role");
  const [role, setRole] = useState<"user" | "provider">("user");

  const handleSignUp = async (data: {
    name: string;
    email: string;
    password?: string;
    role: "user" | "provider";
  }) => {
    try {
      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }).unwrap();
      setStep("success");
      toast.success("Verification email sent.");
    } catch (err) {
      console.error("SignUp failed", err);
      toast.error("Sign up failed. Please try again.");
    }
  };

  const handleRoleSelect = (selectedRole: "user" | "provider") => {
    setRole(selectedRole);
    setStep("details");
  };

  const serverError = getErrorFromRtkQuery(error);

  return (
    <>
      {step === "details" && (
        <button
          type="button"
          onClick={() => setStep("role")}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <RiArrowLeftLine className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-heading font-bold uppercase tracking-wider">
            Back to Role Selection
          </span>
        </button>
      )}

      {step === "role" && (
        <Link
          to="/"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <RiArrowLeftLine className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-heading font-bold uppercase tracking-wider">
            Return Home
          </span>
        </Link>
      )}

      <div className="mb-10">
        <h2 className="text-3xl font-heading font-bold uppercase mb-2 text-foreground">
          {step === "role"
            ? "Select Account Type"
            : step === "details"
              ? "Account Details"
              : "Verify Your Email"}
        </h2>
        <p className="text-muted-foreground">
          {step === "role"
            ? "Choose how you want to use Karibu."
            : step === "details"
              ? `Completing registration as a ${role === "user" ? "Contractor / Customer" : "Supplier / Service Provider"}.`
              : "We've sent a verification link to your email address."}
        </p>
      </div>

      {step === "role" ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleRoleSelect("user")}
            className="w-full p-6 border border-muted hover:border-primary/50 bg-muted/10 hover:bg-muted/20 rounded-sm transition-all text-left group flex items-start space-x-4"
          >
            <div className="p-3 bg-background rounded-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <RiBriefcaseLine className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold uppercase mb-1">
                Contractor / Customer
              </h3>
              <p className="text-sm text-muted-foreground">
                I want to source materials and find construction services.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("provider")}
            className="w-full p-6 border border-muted hover:border-primary/50 bg-muted/10 hover:bg-muted/20 rounded-sm transition-all text-left group flex items-start space-x-4"
          >
            <div className="p-3 bg-background rounded-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <RiStoreLine className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold uppercase mb-1">
                Supplier / Provider
              </h3>
              <p className="text-sm text-muted-foreground">
                I want to list materials or services for the construction
                industry.
              </p>
            </div>
          </button>
        </div>
      ) : step === "details" ? (
        <SignUpForm
          role={role}
          onSubmit={handleSignUp}
          isLoading={isLoading}
          serverError={serverError}
        />
      ) : (
        <div className="space-y-6 text-center py-12 border border-dashed border-border rounded-none bg-muted/5 relative overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

          <div className="w-16 h-16 bg-primary/10 text-primary mx-auto flex items-center justify-center rounded-none rotate-45 mb-8 relative z-10">
            <RiMailLine className="w-8 h-8 -rotate-45" />
          </div>
          <div className="space-y-3 relative z-10 px-6">
            <p className="font-black uppercase tracking-[0.3em] text-sm text-foreground">
              Verification Email Sent
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest max-w-xs mx-auto leading-relaxed font-bold">
              Please check your inbox and click the verification link to
              activate your account. You can sign in once verified.
            </p>
          </div>
          <div className="pt-4 relative z-10">
            <Link to="/auth/signin">
              <Button
                variant="outline"
                className="rounded-none font-black uppercase tracking-[0.3em] text-[10px] h-12 px-8 border-border/40"
              >
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link
          to="/auth/signin"
          className="text-primary font-bold hover:underline"
        >
          Sign In
        </Link>
      </div>
    </>
  );
}
