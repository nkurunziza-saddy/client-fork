import { RiArrowLeftLine } from "@remixicon/react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { SignInForm } from "@/features/forms/components/sign-in-form";
import { getErrorFromRtkQuery } from "@/lib/utils";
import {
  useResendVerificationEmailMutation,
  useSignInMutation,
} from "@/services/api/auth";
import { setToken, setUser } from "@/store/slices/auth-slice";

export function SignInPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/signin" });
  const dispatch = useDispatch();
  const [signIn, { isLoading, error }] = useSignInMutation();
  const [resendVerification, { isLoading: isResending }] =
    useResendVerificationEmailMutation();

  const from = (search as any).from;
  const [lastEmail, setLastEmail] = useState("");

  const serverError = getErrorFromRtkQuery(error);
  const isEmailNotVerified =
    !!serverError &&
    serverError.toLowerCase().includes("email") &&
    serverError.toLowerCase().includes("verif");

  const handleSignIn = async (data: { email: string; password?: string }) => {
    setLastEmail(data.email);
    try {
      const result = await signIn(data).unwrap();
      dispatch(setToken(result.token));
      dispatch(
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          needsOnboarding: result.user.needsOnboarding,
        }),
      );

      const isAdmin =
        result.user.role === "admin" || result.user.role === "agent";
      const isProvider = result.user.role === "provider";
      const needsOnboarding = result.user.needsOnboarding;

      if (from) {
        window.location.href = from;
      } else if (needsOnboarding) {
        navigate({ to: "/onboarding", replace: true });
      } else if (isAdmin) {
        navigate({ to: "/admin", replace: true });
      } else if (isProvider) {
        navigate({ to: "/dashboard", replace: true });
      } else {
        navigate({ to: "/", replace: true });
      }
    } catch (err) {
      console.error("SignIn failed", err);
    }
  };

  const handleResendVerification = async () => {
    if (!lastEmail) return;
    try {
      await resendVerification({ email: lastEmail }).unwrap();
      toast.success("Verification email sent! Check your inbox.");
    } catch {
      toast.error("Failed to resend verification email. Please try again.");
    }
  };

  return (
    <>
      <Link
        to="/"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <RiArrowLeftLine className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-heading font-bold uppercase tracking-wider">
          Return Home
        </span>
      </Link>

      <div className="mb-10">
        <h2 className="text-3xl font-heading font-bold uppercase mb-2 text-foreground">
          Sign In
        </h2>
        <p className="text-muted-foreground">
          Enter your details to access your account.
        </p>
      </div>

      <SignInForm
        onSubmit={handleSignIn}
        isLoading={isLoading}
        serverError={serverError}
        showResendVerification={isEmailNotVerified}
        onResendVerification={handleResendVerification}
        isResending={isResending}
      />

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground font-medium">
          New to the platform?{" "}
          <Link
            to="/auth/signup"
            className="text-primary font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </>
  );
}
