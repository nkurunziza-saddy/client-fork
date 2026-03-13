import {
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiShieldLine,
} from "@remixicon/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card as AdminCard } from "@/shared/components/admin/card";

interface PasswordCardProps {
  passwordData: Record<string, string>;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (show: boolean) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({
  passwordData,
  showPassword,
  setShowPassword,
  showNewPassword,
  setShowNewPassword,
  onPasswordChange,
}) => {
  return (
    <AdminCard
      title="Change Password"
      subtitle="Update your login details"
      headerActions={<RiLockLine size={16} className="text-primary" />}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={onPasswordChange}
              placeholder="CURRENT PASSWORD"
              className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary h-12 text-sm bg-background font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              {showPassword ? (
                <RiEyeOffLine size={16} />
              ) : (
                <RiEyeLine size={16} />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={onPasswordChange}
              placeholder="NEW PASSWORD"
              className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary h-12 text-sm bg-background font-mono"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              {showNewPassword ? (
                <RiEyeOffLine size={16} />
              ) : (
                <RiEyeLine size={16} />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={onPasswordChange}
            placeholder="RE-ENTER NEW PASSWORD"
            className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary h-12 text-sm bg-background font-mono"
          />
        </div>

        <Button className="w-full h-12 rounded-sm font-heading font-bold uppercase text-xs tracking-widest mt-2 shadow-lg shadow-primary/10">
          Update Password
        </Button>
      </div>
    </AdminCard>
  );
};

interface AccountSecurityCardProps {
  securitySettings: Record<string, unknown>;
  onSecurityToggle: (
    key: "twoFactorAuth" | "loginAlerts" | "sessionTimeout",
  ) => void;
  onSessionTimeoutChange: (value: number) => void;
}

export const AccountSecurityCard: React.FC<AccountSecurityCardProps> = ({
  securitySettings,
  onSecurityToggle,
  onSessionTimeoutChange,
}) => {
  return (
    <AdminCard
      title="Account Security"
      subtitle="Security settings"
      headerActions={<RiShieldLine size={16} className="text-primary" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 bg-muted/30 border border-border rounded-sm">
            <div className="min-w-0 pr-4">
              <p className="font-heading font-bold text-sm text-foreground uppercase tracking-widest leading-none mb-2">
                Two-Factor Auth
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                Add an extra layer of protection
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSecurityToggle("twoFactorAuth")}
              className={`relative w-12 h-6 rounded-sm transition-all border ${
                securitySettings.twoFactorAuth
                  ? "bg-primary border-primary"
                  : "bg-muted border-border"
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-sm transition-all ${
                  securitySettings.twoFactorAuth
                    ? "translate-x-7 bg-background"
                    : "translate-x-1 bg-muted-foreground"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-5 bg-muted/30 border border-border rounded-sm">
            <div className="min-w-0 pr-4">
              <p className="font-heading font-bold text-sm text-foreground uppercase tracking-widest leading-none mb-2">
                Login Alerts
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                Get notified of new logins
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSecurityToggle("loginAlerts")}
              className={`relative w-12 h-6 rounded-sm transition-all border ${
                securitySettings.loginAlerts
                  ? "bg-primary border-primary"
                  : "bg-muted border-border"
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-sm transition-all ${
                  securitySettings.loginAlerts
                    ? "translate-x-7 bg-background"
                    : "translate-x-1 bg-muted-foreground"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-6 bg-foreground text-background rounded-sm relative overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 african-pattern opacity-10 invert" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
              Automatic Logout
            </p>
            <h4 className="text-xl font-heading font-bold uppercase mb-4 leading-none">
              Session Timeout
            </h4>
            <div className="space-y-4">
              <select
                value={securitySettings.sessionTimeout as number}
                onChange={(e) =>
                  onSessionTimeoutChange(parseInt(e.target.value, 10))
                }
                className="w-full px-4 py-3 border border-background/20 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-xs font-heading font-bold uppercase tracking-widest h-12 bg-background/5 text-background"
              >
                <option value={30} className="text-foreground">
                  30 MINUTES
                </option>
                <option value={60} className="text-foreground">
                  1 HOUR
                </option>
                <option value={120} className="text-foreground">
                  2 HOURS
                </option>
                <option value={480} className="text-foreground">
                  8 HOURS
                </option>
              </select>
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                You will be logged out automatically after being inactive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
};
