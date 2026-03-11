import { RiBuilding2Line, RiNotification3Line } from "@remixicon/react";
import {
	Camera,
	Globe,
	Lock,
	Mail,
	Save,
	Shield,
	Smartphone,
	Upload,
	User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card as AdminCard } from "@/features/admin/components/card";
import { cn } from "@/lib/utils";

interface ProfileSettingsProps {
	supplierData: any;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ supplierData }) => {
	const [activeTab, setActiveTab] = useState("profile");

	const [profileData, setProfileData] = useState({
		fullName: supplierData?.contactPerson || "John Habimana",
		email: supplierData?.email || "john@afrikamarket.com",
		phone: supplierData?.phone || "+250 788 123 456",
		position: supplierData?.position || "Sales Manager",
		avatar: supplierData?.avatar || "/logo.svg",
	});

	const [companyData] = useState({
		companyName: supplierData?.name || "AfroTech Imports",
		description:
			supplierData?.description ||
			"Direct importer of construction hardware and specialized industrial components serving East Africa.",
		type: supplierData?.type || "MANUFACTURER_RWANDA",
		location: supplierData?.location || "Kigali, Rwanda",
		address: "123 Business District, Kigali, Rwanda",
		website: "https://afrikamarket.com",
		coverImage: supplierData?.coverImage || "/logo.svg",
		specialties: supplierData?.specialties || [
			"Electronics",
			"Mobile Phones",
			"Computers",
		],
	});

	const tabs = [
		{ id: "profile", label: "My Profile", icon: User },
		{ id: "company", label: "Company Info", icon: RiBuilding2Line },
		{ id: "security", label: "Security", icon: Lock },
		{ id: "notifications", label: "Notifications", icon: RiNotification3Line },
	];

	return (
		<div className="flex flex-col lg:flex-row gap-8">
			{/* Sidebar Tabs */}
			<aside className="w-full lg:w-64 shrink-0">
				<div className="bg-background border border-border/40 rounded-none overflow-hidden">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"w-full flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all text-left border-b border-border last:border-0",
								activeTab === tab.id
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted/50",
							)}
						>
							<tab.icon className="w-4 h-4" />
							{tab.label}
						</button>
					))}
				</div>
			</aside>

			{/* Content Area */}
			<div className="flex-1">
				<AdminCard
					title={tabs.find((t) => t.id === activeTab)?.label}
					subtitle="Update your account settings"
					headerActions={
						<Button
							size="sm"
							className="font-heading font-bold uppercase text-[10px] tracking-widest h-9 px-4 shadow-none rounded-sm"
						>
							<Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes
						</Button>
					}
				>
					{activeTab === "profile" && (
						<div className="space-y-10">
							{/* Avatar */}
							<div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-muted/20 border border-border border-dashed rounded-sm">
								<div className="relative shrink-0">
									<img
										src={profileData.avatar}
										alt="Profile"
										className="w-28 h-28 rounded-sm object-cover border border-background shadow-none"
										onError={(e) => {
											e.currentTarget.src = "/image-fallback.svg";
										}}
									/>
									<button className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2.5 rounded-sm hover:scale-110 transition-transform shadow-none border border-background">
										<Camera className="w-4 h-4" />
									</button>
								</div>
								<div className="text-center sm:text-left flex-1">
									<h4 className="font-heading font-bold text-foreground uppercase tracking-wider mb-1">
										Profile Photo
									</h4>
									<p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-4">
										Maximum size: 2MB • Format: JPG, PNG
									</p>
									<Button
										variant="outline"
										size="sm"
										className="font-heading font-bold uppercase text-[10px] tracking-widest h-9 px-4 border border-border hover:bg-muted shadow-none rounded-sm"
									>
										<Upload className="w-3.5 h-3.5 mr-1.5" /> Update Image
									</Button>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-8">
								<div className="space-y-2">
									<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
										Full Name
									</label>
									<Input
										value={profileData.fullName}
										onChange={(e) =>
											setProfileData({
												...profileData,
												fullName: e.target.value,
											})
										}
										className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
										Job Position
									</label>
									<Input
										value={profileData.position}
										onChange={(e) =>
											setProfileData({
												...profileData,
												position: e.target.value,
											})
										}
										className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
										Email Address
									</label>
									<Input
										value={profileData.email}
										disabled
										className="h-12 bg-muted/20 font-mono text-xs font-bold shadow-none border-border"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
										Phone Number
									</label>
									<Input
										value={profileData.phone}
										onChange={(e) =>
											setProfileData({
												...profileData,
												phone: e.target.value,
											})
										}
										className="h-12 bg-muted/10 font-mono text-xs font-bold shadow-none border-border"
									/>
								</div>
							</div>
						</div>
					)}

					{activeTab === "company" && (
						<div className="space-y-10">
							{/* Cover Image */}
							<div className="relative h-48 bg-muted rounded-sm overflow-hidden border border-border">
								<img
									src={companyData.coverImage}
									alt="Cover"
									className="w-full h-full object-cover opacity-60"
									onError={(e) => {
										e.currentTarget.src = "/image-fallback.svg";
									}}
								/>
								<div className="absolute inset-0 flex items-center justify-center">
									<Button
										variant="outline"
										className="bg-background/80 backdrop-blur-md border-border font-heading font-bold uppercase text-[10px] tracking-widest h-10 shadow-none"
									>
										<Upload className="w-3.5 h-3.5 mr-1.5" /> Update Cover
									</Button>
								</div>
							</div>

							<div className="grid gap-8">
								<div className="space-y-2">
									<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
										Company Name
									</label>
									<Input
										value={companyData.companyName}
										className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
										Company Bio
									</label>
									<textarea
										value={companyData.description}
										rows={4}
										className="w-full p-4 bg-muted/10 border border-border rounded-none focus:ring-1 focus:ring-primary outline-none font-medium text-sm leading-relaxed"
									/>
								</div>

								<div className="grid md:grid-cols-2 gap-8">
									<div className="space-y-2">
										<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
											Business Type
										</label>
										<Input
											value={companyData.type}
											className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
											Website
										</label>
										<Input
											value={companyData.website}
											className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
											Headquarters
										</label>
										<Input
											value={companyData.location}
											className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
											Office Address
										</label>
										<Input
											value={companyData.address}
											className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === "security" && (
						<div className="space-y-10">
							<div className="grid gap-8 max-w-2xl">
								<div className="space-y-6">
									<div className="flex items-center gap-3 mb-2">
										<Shield className="w-5 h-5 text-primary" />
										<h3 className="font-heading font-bold uppercase text-sm tracking-widest">
											Change Password
										</h3>
									</div>
									<div className="space-y-4">
										<div className="space-y-2">
											<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
												Current Password
											</label>
											<Input
												type="password"
												className="h-12 bg-muted/10 font-mono shadow-none border-border"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
												New Password
											</label>
											<Input
												type="password"
												className="h-12 bg-muted/10 font-mono shadow-none border-border"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
												Confirm New Password
											</label>
											<Input
												type="password"
												className="h-12 bg-muted/10 font-mono shadow-none border-border"
											/>
										</div>
										<Button className="font-heading font-bold uppercase text-[10px] tracking-widest h-11 px-8 rounded-sm shadow-xl shadow-primary/20">
											Update Password
										</Button>
									</div>
								</div>

								<div className="pt-8 border-t border-border">
									<div className="flex items-center gap-3 mb-6">
										<Smartphone className="w-5 h-5 text-primary" />
										<h3 className="font-heading font-bold uppercase text-sm tracking-widest">
											Account Access
										</h3>
									</div>
									<div className="p-6 bg-muted/20 border border-border border-dashed rounded-sm flex items-center justify-between">
										<div>
											<p className="font-heading font-bold text-sm text-foreground uppercase tracking-widest leading-none mb-2">
												Two-Factor Auth
											</p>
											<p className="text-[10px] text-muted-foreground uppercase font-black tracking-tight">
												Add an extra layer of security
											</p>
										</div>
										<Switch className="rounded-none scale-90" />
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === "notifications" && (
						<div className="space-y-10">
							<div className="grid gap-6 max-w-2xl">
								<div className="space-y-6">
									<div className="flex items-center gap-3 mb-2">
										<RiNotification3Line className="w-5 h-5 text-primary" />
										<h3 className="font-heading font-bold uppercase text-sm tracking-widest">
											Alert Preferences
										</h3>
									</div>
									<div className="space-y-4">
										{[
											{
												label: "Email Alerts",
												desc: "Get notified via email for new inquiries",
												icon: Mail,
											},
											{
												label: "SMS Alerts",
												desc: "Get phone alerts for high-priority leads",
												icon: Smartphone,
											},
											{
												label: "Browser Alerts",
												desc: "Desktop notifications for live dashboard activity",
												icon: Globe,
											},
										].map((n) => (
											<div
												key={n.label}
												className="p-6 bg-muted/20 border border-border border-dashed rounded-sm flex items-center justify-between hover:bg-muted/30 transition-colors"
											>
												<div className="flex items-center gap-4">
													<div className="w-10 h-10 bg-background flex items-center justify-center text-muted-foreground/40 border border-border">
														<n.icon className="w-4 h-4" />
													</div>
													<div>
														<p className="font-heading font-bold text-sm text-foreground uppercase tracking-widest leading-none mb-2">
															{n.label}
														</p>
														<p className="text-[10px] text-muted-foreground uppercase font-black tracking-tight">
															{n.desc}
														</p>
													</div>
												</div>
												<Switch className="rounded-none scale-90" />
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}
				</AdminCard>
			</div>
		</div>
	);
};

export default ProfileSettings;
