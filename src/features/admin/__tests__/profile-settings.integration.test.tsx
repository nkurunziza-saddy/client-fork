import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { AdminProfileSettingsPage } from "../components/profile-settings-page";

// Mock the hook directly
vi.mock("@/hooks/use-admin-profile", () => ({
  useAdminProfile: vi.fn(),
}));

import { useAdminProfile } from "@/hooks/use-admin-profile";

const defaultMockValue = {
  isEditing: false,
  setIsEditing: vi.fn(),
  showPassword: false,
  setShowPassword: vi.fn(),
  showNewPassword: false,
  setShowNewPassword: vi.fn(),
  formData: {
    fullName: "Original Admin",
    email: "admin@example.com",
    phone: "12345678",
    location: "Kigali",
    bio: "Some bio",
    avatar: "/logo.svg",
  },
  passwordData: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  notifications: {
    emailNotifications: true,
    orderAlerts: true,
    customerMessages: true,
    systemUpdates: false,
  },
  securitySettings: {
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 60,
  },
  handleInputChange: vi.fn(),
  handlePasswordChange: vi.fn(),
  handleNotificationToggle: vi.fn(),
  handleSecurityToggle: vi.fn(),
  handleSessionTimeoutChange: vi.fn(),
  handleSaveProfile: vi.fn(),
  isLoading: false,
  isUpdating: false,
};

describe("AdminProfileSettings Integration", () => {
  it("allows editing and saving profile information", async () => {
    const handleSaveProfile = vi.fn();
    const setIsEditing = vi.fn();
    const handleInputChange = vi.fn();

    (useAdminProfile as Mock).mockReturnValue({
      ...defaultMockValue,
      setIsEditing,
      handleInputChange,
      handleSaveProfile,
    });

    renderWithProviders(<AdminProfileSettingsPage />);

    // 1. Click Edit button
    const editButton = await screen.findByRole("button", {
      name: /Edit Profile/i,
    });
    fireEvent.click(editButton);
    expect(setIsEditing).toHaveBeenCalledWith(true);

    // Switch mock to editing state
    (useAdminProfile as Mock).mockReturnValue({
      ...defaultMockValue,
      isEditing: true,
      setIsEditing,
      handleInputChange,
      handleSaveProfile,
    });

    // Re-render
    renderWithProviders(<AdminProfileSettingsPage />);

    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, {
      target: { value: "Updated Admin", name: "fullName" },
    });
    expect(handleInputChange).toHaveBeenCalled();

    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    fireEvent.click(saveButton);
    expect(handleSaveProfile).toHaveBeenCalled();
  });
});
