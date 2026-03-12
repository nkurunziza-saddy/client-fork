import { RiCloseLine, RiSaveLine, RiUserLine } from "@remixicon/react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card as AdminCard } from "@/features/admin/components/card";

interface ProfileInfoCardProps {
	isEditing: boolean;
	formData: any;
	isUpdating?: boolean;
	onEdit: () => void;
	onCancel: () => void;
	onSave: () => void;
	onInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
	isEditing,
	formData,
	isUpdating,
	onEdit,
	onCancel,
	onSave,
	onInputChange,
}) => {
	return (
		<div className="space-y-6">
			{/* Profile Header Card */}
			<AdminCard noPadding className="overflow-hidden">
				<div className="bg-muted h-32 relative">
					<div className="absolute inset-0 african-pattern opacity-10" />
					<div className="absolute inset-0 bg-linear-to-t from-muted/80 to-transparent" />
				</div>

				<div className="px-6 pb-6">
					<div className="flex flex-col md:flex-row gap-8 -mt-12 relative z-10">
						<div className="relative group shrink-0">
							<div className="w-28 h-28 rounded-sm border-4 border-background overflow-hidden shadow-xl">
								<img
									src={formData.avatar}
									alt="Profile"
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
									onError={(e) => {
										e.currentTarget.src = "/image-fallback.svg";
									}}
								/>
							</div>
							<button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-sm hover:bg-primary/90 transition-all shadow-lg translate-y-1/4 translate-x-1/4 border border-background">
								<RiUserLine size={16} />
							</button>
						</div>

						<div className="flex flex-col justify-end flex-1 pt-12 md:pt-0">
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-1">
								<div>
									<h2 className="text-3xl font-heading font-bold text-foreground uppercase tracking-tight leading-none mb-3">
										{formData.fullName}
									</h2>
									<div className="flex flex-wrap gap-3">
										<Badge
											variant="outline"
											className="bg-primary/5 text-primary border-primary/20 font-heading font-bold text-[9px] uppercase tracking-widest px-2.5 py-1"
										>
											Administrator
										</Badge>
										<Badge
											variant="outline"
											className="bg-success/5 text-success border-success/10 font-heading font-bold text-[9px] uppercase tracking-widest px-2.5 py-1"
										>
											Online
										</Badge>
									</div>
								</div>

								{!isEditing && (
									<Button
										onClick={onEdit}
										className="rounded-sm h-11 px-8 font-heading font-bold uppercase text-xs tracking-widest shadow-xl shadow-primary/20"
									>
										Edit Profile
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</AdminCard>

			{/* Personal Information Card */}
			<AdminCard
				title="Personal Information"
				subtitle="Basic account details"
				headerActions={<RiUserLine size={16} className="text-primary" />}
			>
				{isEditing ? (
					<div className="space-y-6">
						<div className="space-y-2">
							<label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
								Full Name
							</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={onInputChange}
								className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary h-12 text-sm bg-background font-bold uppercase tracking-wider"
							/>
						</div>

						<div className="space-y-2">
							<label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
								Email Address
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={onInputChange}
								className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary h-12 text-sm bg-background font-mono font-bold"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
									Phone Number
								</label>
								<input
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={onInputChange}
									className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary h-12 text-sm bg-background font-mono font-bold"
								/>
							</div>

							<div className="space-y-2">
								<label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
									Location
								</label>
								<input
									type="text"
									name="location"
									value={formData.location}
									onChange={onInputChange}
									className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary h-12 text-sm bg-background font-bold uppercase tracking-wider"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
								Bio
							</label>
							<textarea
								name="bio"
								value={formData.bio}
								onChange={onInputChange}
								rows={3}
								className="w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none bg-background font-medium uppercase tracking-wider"
							/>
						</div>

						<div className="flex gap-3 pt-4 border-t-2 border-border">
							<Button
								onClick={onSave}
								disabled={isUpdating}
								className="flex-1 rounded-sm h-12 font-heading font-bold uppercase text-xs tracking-widest shadow-xl shadow-primary/20"
							>
								<RiSaveLine size={16} className="mr-2" />
								{isUpdating ? "Saving..." : "Save Changes"}
							</Button>
							<Button
								variant="outline"
								onClick={onCancel}
								className="flex-1 rounded-sm h-12 border border-border font-heading font-bold uppercase text-xs tracking-widest"
							>
								<RiCloseLine size={16} className="mr-2" />
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-8">
						<div className="border-b-2 border-border border-dashed pb-4">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-heading font-bold mb-2">
								Full Name
							</p>
							<p className="text-foreground font-black text-sm uppercase tracking-tight">
								{formData.fullName}
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b-2 border-border border-dashed pb-4">
							<div>
								<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-heading font-bold mb-2">
									Email Address
								</p>
								<p className="text-foreground font-bold text-xs font-mono">
									{formData.email}
								</p>
							</div>
							<div>
								<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-heading font-bold mb-2">
									Phone Number
								</p>
								<p className="text-foreground font-bold text-xs font-mono">
									{formData.phone}
								</p>
							</div>
						</div>
						<div className="border-b-2 border-border border-dashed pb-4">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-heading font-bold mb-2">
								Location
							</p>
							<p className="text-foreground font-bold text-sm uppercase tracking-wide">
								{formData.location}
							</p>
						</div>
						<div>
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-heading font-bold mb-2">
								Bio
							</p>
							<p className="text-muted-foreground font-medium text-xs italic leading-relaxed border-l-4 border-primary/10 pl-4 py-2 bg-muted/5">
								"{formData.bio}"
							</p>
						</div>
					</div>
				)}
			</AdminCard>
		</div>
	);
};
