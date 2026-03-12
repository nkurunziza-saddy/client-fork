import {
	RiArrowLeftLine,
	RiHeartFill,
	RiHeartLine,
	RiLayoutGridLine,
	RiUserLine,
} from "@remixicon/react";
import {
	LayoutList as RiListCheckLine,
	Package as RiPackageLine,
	Settings as RiServiceLine,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
	useGetWishlistQuery,
	useRemoveFromWishlistMutation,
} from "@/services/api/wishlist";
import type { RootState } from "@/store";
import type { MarketplaceItem, WishlistItem } from "@/types";
import { ProductCard } from "./catalog/product-card";
import { ServiceCard } from "./catalog/service-card";

interface WishlistProps {
	onBack: () => void;
	onProductClick: (item: MarketplaceItem) => void;
	onSupplierClick: (supplierId: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({
	onBack,
	onProductClick,
	onSupplierClick,
}) => {
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated,
	);
	const { data: wishlistRaw = [], isLoading } = useGetWishlistQuery(undefined, {
		skip: !isAuthenticated,
	});
	const [removeFromWishlist] = useRemoveFromWishlistMutation();

	const [activeTab, setActiveTab] = useState<
		"products" | "services" | "suppliers"
	>("products");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	const products = useMemo<WishlistItem[]>(
		() =>
			Array.isArray(wishlistRaw)
				? wishlistRaw.filter((item) => item.type === "product")
				: [],
		[wishlistRaw],
	);

	const services = useMemo<WishlistItem[]>(
		() =>
			Array.isArray(wishlistRaw)
				? wishlistRaw.filter((item) => item.type === "service")
				: [],
		[wishlistRaw],
	);

	const companies = useMemo<WishlistItem[]>(
		() =>
			Array.isArray(wishlistRaw)
				? wishlistRaw.filter((item) => item.type === "company")
				: [],
		[wishlistRaw],
	);

	const wishlistCount = wishlistRaw.length;

	const handleToggleWishlist = (e: React.MouseEvent, item: WishlistItem) => {
		e.stopPropagation();
		removeFromWishlist({ id: item.id, type: item.type });
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-pulse text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em]">
					Loading Wishlist...
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* header */}
			<div className="bg-background border-b border-border sticky top-0 z-30">
				<div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								onClick={onBack}
								variant="ghost"
								className="gap-2 font-display uppercase text-[10px] font-bold tracking-widest rounded-none border border-border/10 h-10 px-4"
							>
								<RiArrowLeftLine className="w-4 h-4" />
								Back
							</Button>
							<div>
								<h1 className="text-2xl font-display font-extrabold uppercase text-foreground flex items-center gap-2 tracking-tight">
									<RiHeartLine className="w-6 h-6 text-primary" />
									Wishlist
								</h1>
								<p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest mt-1">
									{wishlistCount} items saved
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex items-center bg-muted/30 border border-border/10 p-1 rounded-none">
								<Button
									onClick={() => setViewMode("grid")}
									variant={viewMode === "grid" ? "secondary" : "ghost"}
									size="icon"
									className="rounded-none h-8 w-8"
								>
									<RiLayoutGridLine className="w-4 h-4" />
								</Button>
								<Button
									onClick={() => setViewMode("list")}
									variant={viewMode === "list" ? "secondary" : "ghost"}
									size="icon"
									className="rounded-none h-8 w-8"
								>
									<RiListCheckLine className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* tabs */}
			<div className="bg-background border-b border-border/10">
				<div className="max-w-[1600px] mx-auto px-4 md:px-6">
					<div className="flex gap-8">
						<button
							type="button"
							onClick={() => setActiveTab("products")}
							className={`flex items-center py-5 px-1 border-b-2 font-display font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${
								activeTab === "products"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground/40 hover:text-foreground"
							}`}
						>
							<RiPackageLine className="w-4 h-4 mr-2" />
							Products ({products.length})
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("services")}
							className={`flex items-center py-5 px-1 border-b-2 font-display font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${
								activeTab === "services"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground/40 hover:text-foreground"
							}`}
						>
							<RiServiceLine className="w-4 h-4 mr-2" />
							Services ({services.length})
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("suppliers")}
							className={`flex items-center py-5 px-1 border-b-2 font-display font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${
								activeTab === "suppliers"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground/40 hover:text-foreground"
							}`}
						>
							<RiUserLine className="w-4 h-4 mr-2" />
							Suppliers ({companies.length})
						</button>
					</div>
				</div>
			</div>

			{/* content */}
			<div className="max-w-[1600px] mx-auto px-4 md:px-6 py-12">
				{activeTab === "products" && (
					<div>
						{products.length === 0 ? (
							<div className="text-center py-32 border border-dashed border-border/20">
								<RiPackageLine className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
								<h3 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground/40">
									No products in wishlist
								</h3>
							</div>
						) : (
							<div
								className={`grid gap-6 ${
									viewMode === "grid"
										? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
										: "grid-cols-1"
								}`}
							>
								{products.map((item) => (
									<ProductCard
										key={item.id}
										product={item as MarketplaceItem}
										viewMode={viewMode}
										isInWishlist={true}
										onToggleWishlist={(e) => handleToggleWishlist(e, item)}
										onClick={() => onProductClick(item as MarketplaceItem)}
										onSupplierClick={(e) => {
											e.stopPropagation();
											if ("company" in item && item.company?.id) {
												onSupplierClick(item.company.id);
											}
										}}
									/>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "services" && (
					<div>
						{services.length === 0 ? (
							<div className="text-center py-32 border border-dashed border-border/20">
								<RiServiceLine className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
								<h3 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground/40">
									No services in wishlist
								</h3>
							</div>
						) : (
							<div
								className={`grid gap-6 ${
									viewMode === "grid"
										? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
										: "grid-cols-1"
								}`}
							>
								{services.map((item) => (
									<ServiceCard
										key={item.id}
										service={item as any}
										viewMode={viewMode}
										isInWishlist={true}
										onToggleWishlist={(e) => handleToggleWishlist(e, item)}
										onClick={() => onProductClick(item as MarketplaceItem)}
										onSupplierClick={(e) => {
											e.stopPropagation();
											if ("company" in item && item.company?.id) {
												onSupplierClick(item.company.id);
											}
										}}
									/>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "suppliers" && (
					<div>
						{companies.length === 0 ? (
							<div className="text-center py-32 border border-dashed border-border/20">
								<RiUserLine className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
								<h3 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground/40">
									No saved suppliers yet
								</h3>
								<p className="text-xs text-muted-foreground/30 mt-2">
									Visit a supplier page and click "Save to Favorites"
								</p>
							</div>
						) : (
							<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{companies.map((item) => (
									<div
										key={item.id}
										className="group border border-border/20 bg-card hover:border-primary/30 transition-all duration-200 cursor-pointer relative"
										onClick={() => onSupplierClick(item.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ")
												onSupplierClick(item.id);
										}}
										role="button"
										tabIndex={0}
									>
										<div className="p-5">
											<div className="flex items-start gap-3 mb-3">
												{(item as any).logoUrl ? (
													<img
														src={(item as any).logoUrl}
														alt={(item as any).name}
														className="w-12 h-12 object-cover rounded-none border border-border/20 shrink-0"
														onError={(e) => {
															e.currentTarget.src = "/image-fallback.svg";
														}}
													/>
												) : (
													<div className="w-12 h-12 bg-muted/30 border border-border/20 flex items-center justify-center shrink-0">
														<RiUserLine className="w-5 h-5 text-muted-foreground/40" />
													</div>
												)}
												<div className="flex-1 min-w-0">
													<h4 className="font-display font-bold text-sm uppercase tracking-tight truncate group-hover:text-primary transition-colors">
														{(item as any).name || "Unnamed Supplier"}
													</h4>
													{(item as any).businessType && (
														<p className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-widest mt-0.5">
															{(item as any).businessType}
														</p>
													)}
												</div>
											</div>
											{(item as any).district && (
												<p className="text-[10px] text-muted-foreground/40 truncate">
													{(item as any).district}
												</p>
											)}
										</div>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handleToggleWishlist(e, item);
											}}
											className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-muted-foreground/30 hover:text-primary transition-colors"
										>
											<RiHeartFill className="w-4 h-4 text-primary" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Wishlist;
