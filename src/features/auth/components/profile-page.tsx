import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import {
	CheckCircle2,
	Image as ImageIcon,
	Loader2,
	Mail,
	Phone,
	User,
} from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFormFieldErrors, handleRtkQueryError } from "@/lib/utils";
import { useGetMyCompanyQuery } from "@/services/api/companies";
import {
	useGetProfileQuery,
	useUpdateProfileMutation,
} from "@/services/api/users";
import { FormField } from "@/shared/components/form-field";
import { type ProfileFormValues, profileSchema } from "@/shared/schemas/auth";
import type { RootState } from "@/store";

export function ProfilePage() {
	const { user } = useSelector((state: RootState) => state.auth);
	const { data: profile, isLoading } = useGetProfileQuery();
	const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

	const { data: company, isLoading: isLoadingCompany } = useGetMyCompanyQuery(
		undefined,
		{
			skip: user?.role !== "provider",
		},
	);

	const userId = profile?.id ?? user?.id;

	const form = useForm({
		defaultValues: {
			name: profile?.name ?? user?.name ?? "",
			phoneNumber: profile?.phoneNumber ?? "",
			image: profile?.image ?? "",
		} as ProfileFormValues,
		validators: {
			onChange: profileSchema,
		},
		onSubmit: async ({ value }) => {
			if (!userId) return;
			try {
				await updateProfile({
					id: userId,
					data: {
						name: value.name.trim() || undefined,
						phoneNumber: value.phoneNumber?.trim() || undefined,
						image: value.image?.trim() || undefined,
					},
				}).unwrap();
				toast.success("Profile updated successfully");
			} catch (err) {
				handleRtkQueryError(err, "Failed to update profile");
			}
		},
	});

	// Update form when profile data changes
	useEffect(() => {
		if (profile) {
			form.setFieldValue("name", profile.name ?? "");
			form.setFieldValue("phoneNumber", profile.phoneNumber ?? "");
			form.setFieldValue("image", profile.image ?? "");
		}
	}, [profile, form]);

	if (isLoading) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
				<p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
					Loading profile...
				</p>
			</div>
		);
	}

	const email = profile?.email ?? user?.email;

	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<div className="grid md:grid-cols-12 gap-12">
				{/* Left Sidebar: Preview */}
				<div className="md:col-span-4 space-y-6">
					<div className="bg-muted/30 border border-border/40 p-8 flex flex-col items-center text-center relative overflow-hidden">
						<div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
						<form.Subscribe
							selector={(state) => [state.values.image, state.values.name]}
							children={([image, name]) => (
								<>
									<Avatar className="w-24 h-24 rounded-none border-2 border-primary/20 mb-6 shadow-xl relative z-10">
										<AvatarImage
											src={image || "/logo.svg"}
											className="object-cover"
										/>
										<AvatarFallback className="rounded-none font-display font-black text-2xl">
											{name?.charAt(0) || "U"}
										</AvatarFallback>
									</Avatar>
									<h2 className="font-display font-black uppercase text-lg tracking-tight mb-1 relative z-10">
										{name || "Karibu User"}
									</h2>
								</>
							)}
						/>
						<p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] relative z-10">
							{profile?.role || user?.role || "Member"}
						</p>

						<div className="mt-8 pt-6 border-t border-border/40 w-full flex flex-col gap-3">
							<div className="flex items-center gap-3 text-muted-foreground text-left">
								<Mail className="w-3.5 h-3.5" />
								<span className="text-[10px] font-bold truncate uppercase tracking-widest">
									{email}
								</span>
							</div>
							<form.Subscribe
								selector={(state) => state.values.phoneNumber}
								children={(phoneNumber) =>
									phoneNumber && (
										<div className="flex items-center gap-3 text-muted-foreground text-left">
											<Phone className="w-3.5 h-3.5" />
											<span className="text-[10px] font-bold uppercase tracking-widest">
												{phoneNumber}
											</span>
										</div>
									)
								}
							/>
						</div>
					</div>

					<div className="p-6 border border-border/40 bg-background space-y-4">
						<div className="flex items-center gap-2 text-primary">
							<CheckCircle2 className="w-4 h-4" />
							<span className="text-[10px] font-black uppercase tracking-widest">
								Profile Verification
							</span>
						</div>
						<p className="text-[10px] text-muted-foreground font-medium uppercase leading-relaxed tracking-wider">
							Your profile information is used across the platform to help you
							buy materials and find professional services.
						</p>
					</div>
				</div>

				{/* Right: Edit Form */}
				<div className="md:col-span-8 space-y-8">
					<div>
						<h1 className="text-3xl font-display font-black uppercase text-foreground tracking-tighter leading-none mb-2">
							Account Settings
						</h1>
						<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
							Manage your profile information and contact details
						</p>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-8"
					>
						<div className="grid gap-6">
							<form.Field
								name="name"
								children={(field) => (
									<FormField
										label="Full Name"
										required
										error={getFormFieldErrors(field.state.meta.errors)}
									>
										<div className="relative">
											<User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												className="h-12 pl-10 bg-muted/5 border-border/40 focus:border-primary/40 rounded-none font-bold uppercase tracking-wide text-xs"
												placeholder="Your Name"
											/>
										</div>
									</FormField>
								)}
							/>

							<div className="space-y-2 opacity-60">
								<Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
									<Mail className="w-3 h-3" /> Email Address
								</Label>
								<Input
									value={email ?? ""}
									disabled
									className="h-12 bg-muted/20 border-border/40 rounded-none font-mono text-xs font-bold cursor-not-allowed"
								/>
								<p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
									Email cannot be changed directly
								</p>
							</div>

							<form.Field
								name="phoneNumber"
								children={(field) => (
									<FormField
										label="Phone Number"
										error={getFormFieldErrors(field.state.meta.errors)}
									>
										<div className="relative">
											<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												className="h-12 pl-10 bg-muted/5 border-border/40 focus:border-primary/40 rounded-none font-mono text-xs font-bold"
												placeholder="+250 ..."
											/>
										</div>
									</FormField>
								)}
							/>

							<form.Field
								name="image"
								children={(field) => (
									<FormField
										label="Profile Photo URL"
										error={getFormFieldErrors(field.state.meta.errors)}
									>
										<div className="relative">
											<ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												className="h-12 pl-10 bg-muted/5 border-border/40 focus:border-primary/40 rounded-none font-mono text-[10px]"
												placeholder="https://images.karibu.com/..."
											/>
										</div>
									</FormField>
								)}
							/>
						</div>

						<div className="pt-6 border-t border-border/40 flex justify-between items-center">
							<Link
								to="/auth/forgot-password"
								className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
							>
								Change Password?
							</Link>
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
								children={([canSubmit, isSubmitting]) => (
									<Button
										type="submit"
										disabled={!canSubmit || updating || isSubmitting || !userId}
										className="h-14 px-12 rounded-none font-display font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-primary/20 min-w-[200px]"
									>
										{updating || isSubmitting ? (
											<>
												<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												Saving...
											</>
										) : (
											"Update Profile"
										)}
									</Button>
								)}
							/>
						</div>
					</form>

					{user?.role === "provider" && (
						<div className="mt-12 pt-8 border-t border-border/40 space-y-6">
							<div>
								<h2 className="text-2xl font-display font-black uppercase text-foreground tracking-tighter mb-1">
									Seller Dashboard
								</h2>
								<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
									Manage your business presence on Karibu
								</p>
							</div>

							{isLoadingCompany ? (
								<div className="flex items-center gap-3 text-muted-foreground">
									<Loader2 className="w-4 h-4 animate-spin" />
									<span className="text-[10px] uppercase font-bold tracking-widest">
										Loading company info...
									</span>
								</div>
							) : company ? (
								<div className="bg-muted/10 border border-border/40 p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
									<div>
										<h3 className="font-display font-black text-lg uppercase tracking-tight mb-1">
											{company.name}
										</h3>
										<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
											{company.category?.name || "Uncategorized"} •{" "}
											{company.district}
										</p>
										<div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-primary">
											<span>{company.followersCount || 0} Followers</span>
											<span>
												{company.averageRating
													? `${company.averageRating} Rating`
													: "No Ratings"}
											</span>
										</div>
									</div>
									<Button
										render={<Link to="/dashboard" />}
										className="h-12 px-8 rounded-none text-[10px] font-black uppercase tracking-widest"
									>
										Go to Dashboard
									</Button>
								</div>
							) : (
								<div className="bg-warning/10 border border-warning/20 p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
									<div>
										<h3 className="text-sm font-bold text-warning uppercase tracking-widest mb-1">
											Complete Your Profile
										</h3>
										<p className="text-xs text-warning/80">
											You are registered as a seller but haven't set up your
											company details yet.
										</p>
									</div>
									<Button
										render={<Link to="/onboarding" />}
										variant="default"
										className="bg-warning hover:bg-warning/90 h-10 px-6 rounded-none text-[10px] font-black uppercase tracking-widest text-warning-foreground"
									>
										Register Company
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
