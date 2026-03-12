import { skipToken } from "@reduxjs/toolkit/query";
import {
	RiArrowLeftLine,
	RiBox3Line,
	RiCheckDoubleLine,
	RiMore2Fill,
	RiSendPlane2Fill,
} from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	useGetChatHistoryQuery,
	useGetConversationsQuery,
	useSendMessageMutation,
} from "@/services/api/messages";
import type { RootState } from "@/store";
import type { Message as ChatMessage, ConversationPartner } from "@/types";

function formatTime(iso: string | undefined) {
	if (!iso) return "";
	const date = new Date(iso);
	return date.toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function MessagesPage() {
	const [msg, setMsg] = useState("");
	const messagesScrollRef = useRef<HTMLDivElement>(null);

	const currentUserId = useSelector(
		(state: RootState) => state.auth.user?.id ?? null,
	);

	const { data: conversations = [], isFetching: loadingConversations } =
		useGetConversationsQuery();

	const [activePartnerId, setActivePartnerId] = useState<string | null>(null);

	// On desktop, auto-select first conversation if none selected
	useEffect(() => {
		const isDesktop = window.innerWidth >= 1024;
		if (isDesktop && !activePartnerId && conversations.length > 0) {
			setActivePartnerId(conversations[0].partner.id);
		}
	}, [activePartnerId, conversations]);

	const activeConversation: ConversationPartner | undefined = useMemo(
		() => conversations.find((c) => c.partner.id === activePartnerId),
		[conversations, activePartnerId],
	);

	const chatArgs = activePartnerId
		? { partnerId: activePartnerId, page: 1, limit: 50 }
		: skipToken;

	const { data: chatHistory, isFetching: loadingHistory } =
		useGetChatHistoryQuery(chatArgs);

	const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

	const messages: ChatMessage[] = chatHistory?.items ?? [];

	const scrollToBottom = useCallback(() => {
		const el = messagesScrollRef.current;
		if (el) {
			el.scrollTop = el.scrollHeight;
		}
	}, []);

	useEffect(() => {
		const id = setTimeout(scrollToBottom, 50);
		return () => clearTimeout(id);
	}, [scrollToBottom]); // scroll on new messages

	const handleSend = useCallback(async () => {
		if (!activePartnerId || !msg.trim() || sending) return;
		const content = msg.trim();
		setMsg("");
		try {
			await sendMessage({
				receiverId: activePartnerId,
				content,
			}).unwrap();
		} catch (err) {
			console.error(err);
		}
	}, [activePartnerId, msg, sending, sendMessage]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend],
	);

	const isChatViewVisible = activePartnerId !== null;

	return (
		<div className="h-[calc(100vh-56px)] flex bg-background overflow-hidden relative">
			{/* Conversations List Sidebar */}
			<div
				className={cn(
					"w-full lg:w-80 xl:w-96 border-r border-border flex flex-col bg-muted shrink-0 transition-all duration-300",
					isChatViewVisible ? "hidden lg:flex" : "flex",
				)}
			>
				<div className="p-4 sm:p-5 border-b border-border bg-background shrink-0">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-black uppercase tracking-tight text-foreground">
							Messages
						</h1>
						<div className="lg:hidden">
							{/* Placeholder for potential mobile-only list actions */}
						</div>
					</div>
					<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5 block opacity-60">
						Professional Workspace
					</span>
				</div>

				<div className="flex-1 overflow-y-auto custom-scrollbar">
					<div className="p-2 space-y-1">
						{loadingConversations && (
							<div className="p-8 text-center space-y-3">
								<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
								<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
									Loading chats...
								</p>
							</div>
						)}

						{!loadingConversations && conversations.length === 0 && (
							<div className="p-8">
								<Empty className="border-none p-0 gap-2">
									<EmptyHeader>
										<EmptyMedia variant="icon">
											<RiBox3Line className="w-4 h-4 text-muted-foreground/20" />
										</EmptyMedia>
										<EmptyTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
											No conversations yet
										</EmptyTitle>
									</EmptyHeader>
								</Empty>
							</div>
						)}

						{!loadingConversations &&
							conversations.map((chat) => {
								const isActive = chat.partner.id === activePartnerId;
								return (
									<button
										key={chat.partner.id}
										type="button"
										onClick={() => setActivePartnerId(chat.partner.id)}
										className={cn(
											"w-full text-left p-4 transition-all duration-200 group relative",
											isActive
												? "bg-background border border-border shadow-sm"
												: "hover:bg-background/70 opacity-70 hover:opacity-100",
										)}
									>
										{isActive && (
											<div className="absolute left-0 top-4 bottom-4 w-1 bg-primary" />
										)}
										<div className="flex justify-between items-start mb-1 gap-2">
											<span
												className={cn(
													"text-[11px] font-black uppercase tracking-tight truncate",
													isActive ? "text-primary" : "text-foreground",
												)}
											>
												{chat.partner.name || chat.partner.email}
											</span>
											<span className="text-[9px] font-bold text-muted-foreground uppercase shrink-0">
												{formatTime(chat.lastMessageAt)}
											</span>
										</div>
										<p className="text-[10px] font-medium text-muted-foreground truncate pr-4">
											{chat.lastMessage}
										</p>
									</button>
								);
							})}
					</div>
				</div>
			</div>

			{/* Chat View */}
			<div
				className={cn(
					"flex-1 flex flex-col overflow-hidden bg-background min-w-0 transition-all duration-300",
					!isChatViewVisible ? "hidden lg:flex" : "flex",
				)}
			>
				{activeConversation ? (
					<>
						{/* Chat Header */}
						<div className="h-14 sm:h-[72px] border-b border-border px-4 sm:px-6 flex items-center justify-between bg-background shrink-0 sticky top-0 z-10">
							<div className="flex items-center gap-3 min-w-0">
								<Button
									variant="ghost"
									size="icon"
									className="lg:hidden -ml-2 rounded-none h-9 w-9 shrink-0"
									onClick={() => setActivePartnerId(null)}
								>
									<RiArrowLeftLine className="w-5 h-5" />
								</Button>

								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-foreground flex items-center justify-center text-background text-xs sm:text-sm font-black uppercase tracking-tighter shrink-0">
									{(
										activeConversation.partner.name ||
										activeConversation.partner.email ||
										"?"
									).charAt(0)}
								</div>
								<div className="min-w-0">
									<h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-foreground leading-none mb-1 truncate">
										{activeConversation.partner.name ||
											activeConversation.partner.email}
									</h2>
									<div className="flex items-center gap-1.5">
										<div className="w-1.5 h-1.5 bg-success rounded-full shrink-0" />
										<span className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground">
											Direct Supplier
										</span>
									</div>
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-none border border-border shrink-0 h-9 w-9 sm:h-10 sm:w-10"
							>
								<RiMore2Fill className="w-5 h-5 opacity-60" />
							</Button>
						</div>

						{/* Messages Area */}
						<div
							ref={messagesScrollRef}
							className="flex-1 min-h-0 overflow-y-auto bg-muted bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] custom-scrollbar"
						>
							<div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6">
								{loadingHistory && (
									<div className="text-center py-12">
										<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
										<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
											Syncing history...
										</p>
									</div>
								)}
								{!loadingHistory && messages.length === 0 && (
									<div className="text-center py-12">
										<div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border">
											<RiChatDoubleLine className="w-6 h-6 text-muted-foreground/20" />
										</div>
										<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 max-w-[200px] mx-auto">
											Start a conversation with this supplier
										</p>
									</div>
								)}
								{!loadingHistory &&
									messages.map((m) => {
										const isMe =
											currentUserId != null && m.sender.id === currentUserId;
										return (
											<div
												key={m.id}
												className={cn(
													"flex flex-col animate-in fade-in slide-in-from-bottom-1 duration-300",
													isMe ? "items-end" : "items-start",
												)}
											>
												<div
													className={cn(
														"max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 border relative",
														isMe
															? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10"
															: "bg-background text-foreground border-border shadow-sm",
													)}
												>
													{m.product && (
														<Link
															to="/products/$productId"
															params={{ productId: m.product.id }}
															className={cn(
																"mb-3 flex items-center gap-2 px-3 py-2 border hover:opacity-90 transition-opacity w-full",
																isMe
																	? "bg-background/10 border-background/10"
																	: "bg-primary/5 border-primary/10",
															)}
														>
															<RiBox3Line
																className={cn(
																	"h-4 w-4 shrink-0",
																	isMe ? "text-background/60" : "text-primary",
																)}
															/>
															<div className="flex flex-col min-w-0">
																<span
																	className={cn(
																		"text-[8px] font-black uppercase tracking-widest",
																		isMe
																			? "text-background/40"
																			: "text-primary/60",
																	)}
																>
																	Product Inquiry
																</span>
																<span
																	className={cn(
																		"text-[10px] font-bold truncate",
																		isMe ? "text-background" : "text-primary",
																	)}
																>
																	{m.product.name}
																</span>
															</div>
														</Link>
													)}

													{/* Similar blocks for Service and Auction... simplified for space */}
													{(m.service || m.auction) && (
														<div className="mb-3 flex items-center gap-2 bg-muted-foreground/10 px-3 py-2 border border-muted-foreground/10 text-[10px] font-bold uppercase tracking-widest opacity-60">
															Linked Reference Attached
														</div>
													)}

													<p className="text-[12px] sm:text-[13px] font-medium leading-relaxed break-words">
														{m.content}
													</p>
												</div>

												<div className="flex items-center gap-1.5 mt-1.5 opacity-40">
													<span className="text-[8px] font-bold uppercase tracking-widest">
														{formatTime(m.createdAt)}
													</span>
													{isMe && (
														<RiCheckDoubleLine className="w-3 h-3 text-success" />
													)}
												</div>
											</div>
										);
									})}
							</div>
						</div>

						{/* Input Area */}
						<div className="shrink-0 p-3 sm:p-4 border-t border-border bg-background">
							<div className="max-w-3xl mx-auto flex gap-2 sm:gap-3 items-end">
								<div className="flex-1 relative">
									<Input
										value={msg}
										onChange={(e) => setMsg(e.target.value)}
										onKeyDown={handleKeyDown}
										placeholder="Type your message..."
										className="w-full min-h-[48px] max-h-32 bg-muted border-border focus-visible:ring-0 focus-visible:border-primary/40 text-sm rounded-none px-4 sm:px-5 py-3 transition-all"
										disabled={!activeConversation}
									/>
								</div>
								<Button
									onClick={handleSend}
									disabled={!activePartnerId || !msg.trim() || sending}
									className="h-12 w-12 sm:w-auto sm:px-6 rounded-none bg-foreground hover:bg-foreground/90 transition-all shrink-0 shadow-lg shadow-foreground/10 active:scale-95 text-background"
								>
									<RiSendPlane2Fill className="w-4 h-4 sm:mr-2" />
									<span className="hidden sm:inline font-black uppercase text-[10px] tracking-widest">
										Send
									</span>
								</Button>
							</div>
						</div>
					</>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px]">
						<Empty className="max-w-xs border-none bg-transparent">
							<EmptyHeader>
								<EmptyMedia className="w-16 h-16 rounded-full bg-background shadow-sm border border-border flex items-center justify-center mb-4">
									<RiBox3Line className="w-8 h-8 text-muted-foreground/20" />
								</EmptyMedia>
								<EmptyTitle className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
									Your Inbox
								</EmptyTitle>
								<EmptyDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
									Select a conversation from the left to view messages and
									details
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					</div>
				)}
			</div>
		</div>
	);
}

// Adding a placeholder for the missing icon in the initial read
function RiChatDoubleLine({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			height="24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M7 8v8a2 2 0 0 0 2 2h9l4 4V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2Z" />
			<path d="M15 8V4a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14l4-4h3" />
		</svg>
	);
}
