import { AdminPageSkeleton } from "@/shared/components/skeletons";
import { useAdminProfile } from "@/hooks/use-admin-profile";
import { PageHeader } from "./page-header";
import { ActivityLogsCard } from "./settings/activity-logs-card";
import { NotificationSettingsCard } from "./settings/notification-settings-card";
import { ProfileInfoCard } from "./settings/profile-info-card";
import { AccountSecurityCard, PasswordCard } from "./settings/security-cards";

export function AdminProfileSettingsPage() {
	const {
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
	} = useAdminProfile();

	if (isLoading) {
		return <AdminPageSkeleton />;
	}

	return (
		<div className="space-y-6 pb-20">
			<PageHeader
				title="Account Settings"
				subtitle="Manage your profile and security"
				badge="Profile"
			/>

			<ProfileInfoCard
				isEditing={isEditing}
				isUpdating={isUpdating}
				formData={formData}
				onEdit={() => setIsEditing(true)}
				onCancel={() => setIsEditing(false)}
				onSave={handleSaveProfile}
				onInputChange={handleInputChange}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<PasswordCard
					passwordData={passwordData}
					showPassword={showPassword}
					setShowPassword={setShowPassword}
					showNewPassword={showNewPassword}
					setShowNewPassword={setShowNewPassword}
					onPasswordChange={handlePasswordChange}
				/>
			</div>
			<NotificationSettingsCard
				notifications={notifications}
				onToggle={handleNotificationToggle}
			/>
			<AccountSecurityCard
				securitySettings={securitySettings}
				onSecurityToggle={handleSecurityToggle}
				onSessionTimeoutChange={handleSessionTimeoutChange}
			/>
			<ActivityLogsCard />
		</div>
	);
}
