import {
	RiArrowRightLine,
	RiChat1Line,
	RiFileTextLine,
	RiHeartLine,
	RiMessage3Line,
	RiSettingsLine,
	RiStarLine,
} from "@remixicon/react";
import { Await, Link } from "@tanstack/react-router";
import { useState, Suspense } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { handleRtkQueryError } from "@/lib/utils";
import { useCreateReviewMutation } from "@/services/api/reviews";
import { ReviewModal } from "@/shared/components/review-modal";
import type { RootState } from "@/store";
import type { Product, Service, WishlistItem, ConversationPartner } from "@/types";
import { UserDashboardSkeleton } from "./dashboard-skeletons";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

type PopulatedWishlistItem = (Product | Service) & {
	type: "product" | "service";
};

interface UserDashboardProps {
	deferred: Promise<{
		wishlist: WishlistItem[];
		conversations: ConversationPartner[];
	}>;
}

export default function UserDashboard({ deferred }: UserDashboardProps) {
	const { user } = useSelector((state: RootState) => state.auth);
	const [reviewModalOpen, setReviewModalOpen] = useState(false);
	const [createReview] = useCreateReviewMutation();
	const [selectedItem, setSelectedItem] = useState<{
		provider: string;
		item: string;
		productId?: string;
		companyId?: string;
	} | null>(null);

	return (
		<div className="container mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 py-8 md:py-12">
			{/* Header Section */}
			<div className="mb-8 md:mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center border-b border-border/40 pb-8 md:pb-10">
				<div>
					<div className="flex items-center gap-3 mb-3 md:mb-4">
						<div className="w-8 h-px bg-primary" />
						<span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary">
							Buyer Portal
						</span>
					</div>
					<h1 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase tracking-tighter leading-none">
						Muraho, {user?.name?.split(" ")[0] || "Partner"}
					</h1>
					<p className="mt-3 text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
						Active account · Buying & Sourcing Materials
					</p>
				</div>
				<div className="flex gap-2 sm:gap-3">
					<Link to="/products" className="flex-1 sm:flex-none">
						<Button
							size="lg"
							className="h-12 md:h-14 w-full sm:w-auto rounded-none font-display font-black uppercase tracking-widest text-[9px] md:text-[10px] px-6 md:px-8 shadow-lg shadow-primary/20"
						>
							<RiFileTextLine className="mr-2 h-4 w-4" /> Browse Products
						</Button>
					</Link>
					<Link to="/profile">
						<Button
							size="lg"
							variant="outline"
							className="h-12 w-12 md:h-14 md:w-14 rounded-none border border-border/40 p-0 hover:bg-muted/5 transition-colors"
						>
							<RiSettingsLine className="h-4 w-4 md:h-5 md:w-5" />
						</Button>
					</Link>
				</div>
			</div>

			<Suspense fallback={<UserDashboardSkeleton />}>
				<Await promise={deferred}>
					{({ wishlist, conversations }: { wishlist: WishlistItem[], conversations: ConversationPartner[] }) => {
						const unreadCount = conversations.filter((c) => !!c.lastMessage).length;

						return (
							<>
								{/* Stats Grid */}
								<div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40 border border-border/40 overflow-hidden shadow-sm">
									<div className="bg-background p-6 md:p-8 group hover:bg-muted/5 transition-colors">
										<div className="flex items-center gap-2 mb-3 md:mb-4">
											<RiHeartLine
												size={14}
												className="text-primary opacity-40 group-hover:opacity-100 transition-opacity"
											/>
											<span className="text-[9px] md:text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em]">
												Saved Items
											</span>
										</div>
										<p className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tighter">
											{wishlist.length}
										</p>
									</div>
									<div className="bg-background p-6 md:p-8 group hover:bg-muted/5 transition-colors">
										<div className="flex items-center gap-2 mb-3 md:mb-4">
											<RiMessage3Line
												size={14}
												className="text-primary opacity-40 group-hover:opacity-100 transition-opacity"
											/>
											<span className="text-[9px] md:text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em]">
												Active Chats
											</span>
										</div>
										<p className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tighter">
											{conversations.length}
										</p>
									</div>
									<div className="bg-background p-6 md:p-8 group hover:bg-muted/5 transition-colors sm:col-span-2 lg:col-span-1">
										<div className="flex items-center gap-2 mb-3 md:mb-4">
											<div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
											<span className="text-[9px] md:text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em]">
												Unread Messages
											</span>
										</div>
										<p className="text-4xl md:text-5xl font-display font-black text-primary tracking-tighter">
											{unreadCount}
										</p>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
									{/* Saved Listings */}
									<div className="space-y-6 md:space-y-8 lg:col-span-8">
										<div className="flex items-center gap-4">
											<h2 className="text-lg md:text-xl font-display font-black text-foreground uppercase tracking-tight">
												My Saved Items
											</h2>
											<div className="flex-1 h-px bg-border/40" />
										</div>

										<div className="grid gap-4">
											{wishlist.length === 0 ? (
												<Empty className="py-24 border border-dashed border-border/40 bg-muted/5 rounded-none">
													<EmptyHeader>
														<EmptyMedia variant="icon">
															<RiHeartLine className="w-4 h-4 text-primary" />
														</EmptyMedia>
														<EmptyTitle className="text-[10px] font-black uppercase tracking-widest">
															No Saved Items
														</EmptyTitle>
														<EmptyDescription className="uppercase tracking-widest text-[8px]">
															You haven't saved any items to your wishlist yet.
														</EmptyDescription>
													</EmptyHeader>
												</Empty>
											) : (
												wishlist.slice(0, 6).map((item: WishlistItem) => {
													const listing = item as PopulatedWishlistItem;
													const price =
														"price" in listing
															? listing.price
															: "variants" in listing
																? (listing.variants?.[0]?.price ?? 0)
																: 0;

													return (
														<div
															key={listing.id}
															className="rounded-none border border-border/40 bg-background hover:border-primary/20 transition-all p-5 md:p-6 group relative overflow-hidden"
														>
															<div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-primary transition-all duration-500" />
															<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 md:gap-6">
																<div className="min-w-0">
																	<p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 mb-1 md:mb-2">
																		{listing.category?.name ?? "General Material"}
																	</p>
																	<h3 className="text-base md:text-lg font-display font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
																		{listing.name}
																	</h3>
																	<div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-3">
																		<p className="text-[12px] md:text-sm font-black tracking-tight text-foreground/80 font-mono">
																			RWF {(Number(price) || 0).toLocaleString()}
																		</p>
																		<div className="w-1 h-1 rounded-full bg-border" />
																		<p className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">
																			{listing.company?.name || "Verified Provider"}
																		</p>
																	</div>
																</div>
																<div className="flex gap-2 mt-2 sm:mt-0">
																	<Link
																		className="flex-1 sm:flex-none"
																		to={
																			(listing.type === "product"
																				? `/products/${listing.id}`
																				: `/services/${listing.id}`) as any
																		}
																	>
																		<Button
																			variant="outline"
																			size="sm"
																			className="h-9 w-full rounded-none text-[9px] font-black uppercase tracking-widest border-border/40"
																		>
																			View
																		</Button>
																	</Link>
																	<Button
																		variant="outline"
																		size="sm"
																		className="flex-1 sm:flex-none h-9 rounded-none text-[9px] font-black uppercase tracking-widest border-border/40 hover:border-warning/40 hover:text-warning"
																		onClick={() => {
																			setSelectedItem({
																				provider: listing.company?.name ?? "Supplier",
																				item: listing.name,
																				productId:
																					listing.type === "product"
																						? listing.id
																						: undefined,
																				companyId: listing.company?.id,
																			});
																			setReviewModalOpen(true);
																		}}
																	>
																		<RiStarLine className="mr-1.5 h-3 w-3" /> Review
																	</Button>
																</div>
															</div>
														</div>
													);
												})
											)}
										</div>
									</div>

									{/* Sidebar: Messages & Advice */}
									<div className="space-y-10 lg:col-span-4">
										<div className="space-y-6">
											<h2 className="text-xl font-display font-black text-foreground uppercase tracking-tight">
												Recent Messages
											</h2>
											<div className="rounded-none border border-border/40 bg-background overflow-hidden">
												{conversations.length === 0 ? (
													<Empty className="p-12 rounded-none border-none">
														<EmptyHeader>
															<EmptyTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
																No Active Chats
															</EmptyTitle>
														</EmptyHeader>
													</Empty>
												) : (
													<div className="divide-y divide-border/40">
														{conversations.slice(0, 5).map((conversation: ConversationPartner) => (
															<Link
																key={conversation.partner.id}
																to="/messages"
																className="flex items-center justify-between gap-4 p-5 hover:bg-muted/5 transition-all group"
															>
																<div className="min-w-0">
																	<p className="truncate text-[11px] font-black text-foreground uppercase tracking-tight mb-1 group-hover:text-primary transition-colors">
																		{conversation.partner.name}
																	</p>
																	<p className="truncate text-[10px] font-medium text-muted-foreground italic line-clamp-1">
																		"{conversation.lastMessage}"
																	</p>
																</div>
																<RiArrowRightLine className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
															</Link>
														))}
													</div>
												)}
											</div>
										</div>

										<div className="rounded-none border border-border/40 bg-muted/10 p-8 relative overflow-hidden">
											<div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
											<RiChat1Line className="mb-6 h-8 w-8 text-primary opacity-40" />
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mb-3">
												Messaging Guidelines
											</h4>
											<p className="text-[11px] text-muted-foreground font-medium uppercase leading-relaxed tracking-wider">
												Please keep all negotiations and delivery discussions within this
												platform to ensure safety and transparency.
											</p>
										</div>
									</div>
								</div>
							</>
						);
					}}
				</Await>
			</Suspense>

			<ReviewModal
				isOpen={reviewModalOpen}
				onClose={() => setReviewModalOpen(false)}
				onSubmit={async ({
					rating,
					comment,
				}: {
					rating: number;
					comment: string;
				}) => {
					if (!selectedItem?.productId && !selectedItem?.companyId) {
						toast.error("Unable to attach report target.");
						return;
					}
					try {
						await createReview({
							rating,
							comment,
							productId: selectedItem?.productId,
							companyId: selectedItem?.companyId,
						}).unwrap();
						toast.success("Review submitted successfully.");
					} catch (err) {
						handleRtkQueryError(err, "Failed to submit review");
					}
				}}
				itemName={selectedItem?.item || "Item"}
				providerName={selectedItem?.provider || "Supplier"}
			/>
		</div>
	);
}
