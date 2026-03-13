import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CompanyInfoSectionProps {
	data: {
		companyName: string;
		description: string;
		type: string;
		location: string;
		address: string;
		website: string;
		coverImage: string;
	};
}

export function CompanyInfoSection({ data }: CompanyInfoSectionProps) {
	return (
		<div className="space-y-10">
			{/* Cover Image */}
			<div className="relative h-48 bg-muted rounded-sm overflow-hidden border border-border">
				<img
					src={data.coverImage}
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
						value={data.companyName}
						className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
						Company Bio
					</label>
					<textarea
						value={data.description}
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
							value={data.type}
							className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
							Website
						</label>
						<Input
							value={data.website}
							className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
							Headquarters
						</label>
						<Input
							value={data.location}
							className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
							Office Address
						</label>
						<Input
							value={data.address}
							className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
