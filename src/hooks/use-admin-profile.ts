import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { handleRtkQueryError } from "@/lib/utils";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/services/api/users";

export function useAdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "/logo.svg",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.name || "",
        email: profile.email || "",
        phone: profile.phoneNumber || "",
        location: "Kigali, Rwanda", // Default if not in profile
        bio: "Platform administrator managing Karibu operations.",
        avatar: profile.image || "/logo.svg",
      });
    }
  }, [profile]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts: true,
    customerMessages: true,
    systemUpdates: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 60,
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswordData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleNotificationToggle = useCallback(
    (key: keyof typeof notifications) => {
      setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const handleSecurityToggle = useCallback(
    (key: keyof typeof securitySettings) => {
      setSecuritySettings((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const handleSessionTimeoutChange = useCallback((value: number) => {
    setSecuritySettings((prev) => ({ ...prev, sessionTimeout: value }));
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (!profile?.id) return;

    try {
      await updateProfile({
        id: profile.id,
        data: {
          name: formData.fullName,
          phoneNumber: formData.phone,
          image: formData.avatar,
        },
      }).unwrap();

      toast.success("Profile synchronized successfully");
      setIsEditing(false);
    } catch (err) {
      handleRtkQueryError(err, "Failed to synchronize profile");
    }
  }, [profile?.id, formData, updateProfile]);

  return {
    isEditing,
    setIsEditing,
    showPassword,
    setShowPassword,
    showNewPassword,
    setShowNewPassword,
    formData,
    passwordData,
    notifications,
    securitySettings,
    handleInputChange,
    handlePasswordChange,
    handleNotificationToggle,
    handleSecurityToggle,
    handleSessionTimeoutChange,
    handleSaveProfile,
    isLoading,
    isUpdating,
  };
}
