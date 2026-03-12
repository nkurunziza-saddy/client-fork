import { RiArrowLeftLine } from "@remixicon/react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupplierActions } from "@/hooks/use-supplier-actions";
import { useGetCompanyByIdQuery } from "@/services/api/companies";
import { useGetProductsQuery } from "@/services/api/products";
import type { Product } from "@/types";
import { SupplierActions } from "./details/supplier-actions";
import { SupplierContactModal } from "./details/supplier-contact-modal";
import { SupplierHeader } from "./details/supplier-header";
import { SupplierTabsContent } from "./details/supplier-tabs-content";

type SupplierItem = Product;

interface SupplierDetailsProps {
	supplierId: string;
	onBack: () => void;
	onProductClick: (item: SupplierItem) => void;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({
	supplierId,
	onBack,
	onProductClick,
}) => {
	const {
		data: company,
		isLoading,
		error,
	} = useGetCompanyByIdQuery(supplierId);
	const { data: listingsData } = useGetProductsQuery({ companyId: supplierId });
	const listings = listingsData?.data || [];
	const featuredListings = listings.slice(0, 4);

	const {
		showContactModal,
		setShowContactModal,
		handleOpenContactModal,
		message,
		setMessage,
		handleSubmitInquiry,
		sendingInquiry,
	} = useSupplierActions(company);

	const rating = Number(company?.averageRating ?? 0);
	const location =
		[company?.district, company?.province].filter(Boolean).join(", ") ||
		"Kigali, Rwanda";

	const tags = [
		company?.type?.replace("_", " "),
		"Verified",
		company?.category?.name,
	].filter((t): t is string => Boolean(t));

	const joinedYear = company?.createdAt
		? new Date(company.createdAt).getFullYear()
		: "2024";

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-pulse text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em]">
					Loading supplier...
				</div>
			</div>
		);
	}

	if (error || !company) {
		return (
			<div className="min-h-screen bg-muted/30 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-tighter">
						Supplier Not Found
					</h2>
					<Button onClick={onBack} variant="outline" className="rounded-none">
						Back to Directory
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background space-y-0 overflow-x-hidden industrial-grain pb-24">
			<SupplierActions
				company={company}
				isMobile
				onContactClick={handleOpenContactModal}
			/>

			{/* Top sticky header with supplier name */}
			<div className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-[48px] z-30 py-3 md:py-4 px-4 md:px-8">
				<div className="w-full mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3 overflow-hidden">
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={onBack}
							className="shrink-0"
						>
							<RiArrowLeftLine className="size-4" />
						</Button>
						<div className="h-4 w-px bg-border/60 shrink-0" />
						<h1 className="font-display font-black uppercase text-xs md:text-sm tracking-widest truncate text-foreground">
							{company.name}
						</h1>
					</div>
					<Badge className="shrink-0 bg-primary/10 text-primary border-primary/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-none uppercase hidden sm:block">
						{company.type || "Supplier"}
					</Badge>
				</div>
			</div>

			<div className="w-full mx-auto px-4 md:px-8 lg:px-12 py-12">
				<div className="grid mt-16 md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-start pt-4 md:pt-0">
					<div className="hidden md:block" />

					<div className="space-y-10">
						<SupplierHeader
							company={company}
							location={location}
							rating={rating}
							onContactClick={handleOpenContactModal}
						/>

						<div className="space-y-8">
							{/* Tags */}
							<div className="flex flex-wrap gap-2">
								{tags.map((tag: string, i: number) => (
									<div
										key={i}
										className="px-3 py-1 bg-muted/20 border border-border/40 rounded-none text-[9px] font-black uppercase tracking-wider text-muted-foreground hover:bg-primary/5 hover:border-primary/20 transition-colors"
									>
										{tag}
									</div>
								))}
							</div>

							{/* Quick Stats Row - Tight and technical */}
							<div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border/40 border border-border/40 shadow-sm">
								<div className="bg-background p-4 flex flex-col gap-1 group hover:bg-muted/5 transition-colors">
									<div className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-[0.2em]">
										Active items
									</div>
									<div className="text-2xl font-black font-heading text-foreground tracking-tight group-hover:text-primary transition-colors">
										{listings.length}
									</div>
								</div>
								<div className="bg-background p-4 flex flex-col gap-1 group hover:bg-muted/5 transition-colors">
									<div className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-[0.2em]">
										Views
									</div>
									<div className="text-2xl font-black font-heading text-foreground tracking-tight group-hover:text-primary transition-colors">
										{company.visits || 0}
									</div>
								</div>
								<div className="bg-background p-4 flex flex-col gap-1 group hover:bg-muted/5 transition-colors">
									<div className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-[0.2em]">
										Member since
									</div>
									<div className="text-2xl font-black font-heading text-foreground tracking-tight group-hover:text-primary transition-colors">
										{joinedYear}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs Section */}
				<div className="pt-8 border-t border-border/40">
					<Tabs defaultValue="overview" className="w-full">
						<TabsList variant="line" className="justify-start mb-8">
							{["overview", "products", "reviews", "contact"].map((tab) => (
								<TabsTrigger
									key={tab}
									value={tab}
									className="uppercase text-[10px] font-black tracking-[0.2em]"
								>
									{tab === "overview" ? "Company overview" : tab}
								</TabsTrigger>
							))}
						</TabsList>

						<div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
							<SupplierTabsContent
								company={company}
								listings={listings}
								featuredListings={featuredListings}
								onProductClick={onProductClick}
							/>
						</div>
					</Tabs>
				</div>

				<SupplierContactModal
					company={company}
					message={message}
					setMessage={setMessage}
					sendingInquiry={sendingInquiry}
					isOpen={showContactModal}
					onClose={() => setShowContactModal(false)}
					onSubmit={handleSubmitInquiry}
				/>
			</div>
		</div>
	);
};

export default SupplierDetails;
