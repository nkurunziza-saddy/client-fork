import {
	CheckCircle2,
	Image as ImageIcon,
	Loader2,
	Mail,
	Phone,
	User,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRtkQueryError } from "@/lib/utils";
import {
	useGetProfileQuery,
	useUpdateProfileMutation,
} from "@/services/api/users";
import type { RootState } from "@/store";

export function ProfilePage() {
	const { user } = useSelector((state: RootState) => state.auth);
	const { data: profile, isLoading } = useGetProfileQuery();
	const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [image, setImage] = useState("");

	useEffect(() => {
		if (profile) {
			setName(profile.name ?? "");
			setPhoneNumber(profile.phoneNumber ?? "");
			setImage(profile.image ?? "");
		} else if (user) {
			setName(user.name ?? "");
			setPhoneNumber("");
			setImage("");
		}
	}, [profile, user]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const id = profile?.id ?? user?.id;
		if (!id) return;

		try {
			await updateProfile({
				id,
				data: {
					name: name.trim() || undefined,
					phoneNumber: phoneNumber.trim() || undefined,
					image: image.trim() || undefined,
				},
			}).unwrap();
			toast.success("Profile updated successfully");
		} catch (err) {
			handleRtkQueryError(err, "Failed to update profile");
		}
	};

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
							{name || "AfrikaMarket User"}
						</h2>
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
							{phoneNumber && (
								<div className="flex items-center gap-3 text-muted-foreground text-left">
									<Phone className="w-3.5 h-3.5" />
									<span className="text-[10px] font-bold uppercase tracking-widest">
										{phoneNumber}
									</span>
								</div>
							)}
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

					<form onSubmit={handleSubmit} className="space-y-8">
						<div className="grid gap-6">
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
									<User className="w-3 h-3 text-primary" /> Full Name
								</label>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="h-12 bg-muted/5 border-border/40 focus:border-primary/40 rounded-none font-bold uppercase tracking-wide text-xs"
									placeholder="Your Name"
								/>
							</div>

							<div className="space-y-2 opacity-60">
								<label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
									<Mail className="w-3 h-3" /> Email Address
								</label>
								<Input
									value={email ?? ""}
									disabled
									className="h-12 bg-muted/20 border-border/40 rounded-none font-mono text-xs font-bold cursor-not-allowed"
								/>
								<p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
									Email cannot be changed directly
								</p>
							</div>

							<div className="space-y-2">
								<label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
									<Phone className="w-3 h-3 text-primary" /> Phone Number
								</label>
								<Input
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									className="h-12 bg-muted/5 border-border/40 focus:border-primary/40 rounded-none font-mono text-xs font-bold"
									placeholder="+250 ..."
								/>
							</div>

							<div className="space-y-2">
								<label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
									<ImageIcon className="w-3 h-3 text-primary" /> Profile Photo
									URL
								</label>
								<Input
									value={image}
									onChange={(e) => setImage(e.target.value)}
									className="h-12 bg-muted/5 border-border/40 focus:border-primary/40 rounded-none font-mono text-[10px]"
									placeholder="https://images.afrikamarket.com/..."
								/>
							</div>
						</div>

						<div className="pt-6 border-t border-border/40 flex justify-end">
							<Button
								type="submit"
								disabled={updating || !profile?.id}
								className="h-14 px-12 rounded-none font-display font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-primary/20 min-w-[200px]"
							>
								{updating ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Saving...
									</>
								) : (
									"Update Profile"
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
