import { skipToken } from "@reduxjs/toolkit/query";
import {
	RiAuctionLine,
	RiBox3Line,
	RiCheckDoubleLine,
	RiMore2Fill,
	RiSendPlane2Fill,
	RiWrenchLine,
} from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
	// Ref on the actual scrollable div — not a phantom end element
	const messagesScrollRef = useRef<HTMLDivElement>(null);

	const currentUserId = useSelector(
		(state: RootState) => state.auth.user?.id ?? null,
	);

	const { data: conversations = [], isFetching: loadingConversations } =
		useGetConversationsQuery();

	const [activePartnerId, setActivePartnerId] = useState<string | null>(null);

	useEffect(() => {
		if (!activePartnerId && conversations.length > 0) {
			setActivePartnerId(conversations[0].partner.id);
		}
	}, [activePartnerId, conversations]);

	const activeConversation: ConversationPartner | undefined = useMemo(
		() =>
			conversations.find((c) => c.partner.id === activePartnerId) ??
			conversations[0],
		[conversations, activePartnerId],
	);

	const chatArgs = activeConversation?.partner.id
		? { partnerId: activeConversation.partner.id, page: 1, limit: 50 }
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
	}, [scrollToBottom]);

	const handleSend = useCallback(async () => {
		if (!activeConversation?.partner.id || !msg.trim() || sending) return;
		const content = msg.trim();
		setMsg("");
		try {
			await sendMessage({
				receiverId: activeConversation.partner.id,
				content,
			}).unwrap();
		} catch (err) {
			console.error(err);
		}
	}, [activeConversation, msg, sending, sendMessage]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend],
	);

	return (
		<div className="h-[calc(100vh-48px)] flex bg-white overflow-hidden">
			<div className="w-72 xl:w-80 border-r border-slate-100 flex flex-col bg-slate-50 shrink-0">
				<div className="p-5 border-b border-slate-100 bg-white shrink-0">
					<h1 className="text-xl font-black uppercase tracking-tight text-slate-950">
						Messages
					</h1>
					<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5 block opacity-60">
						Professional Workspace
					</span>
				</div>

				<div className="flex-1 overflow-y-auto">
					<div className="p-2 space-y-1">
						{loadingConversations && (
							<div className="p-4 text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
								Loading conversations…
							</div>
						)}

						{!loadingConversations && conversations.length === 0 && (
							<div className="p-4 text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
								No conversations yet.
							</div>
						)}

						{!loadingConversations &&
							conversations.map((chat) => {
								const isActive =
									chat.partner.id === activeConversation?.partner.id;
								return (
									<button
										key={chat.partner.id}
										type="button"
										onClick={() => setActivePartnerId(chat.partner.id)}
										className={`w-full text-left p-4 transition-all duration-200 ${
											isActive
												? "bg-white border border-slate-200 shadow-sm"
												: "hover:bg-white/70 opacity-60 hover:opacity-100"
										}`}
									>
										<div className="flex justify-between items-start mb-1 gap-2">
											<span
												className={`text-[11px] font-black uppercase tracking-tight truncate ${
													isActive ? "text-primary" : "text-slate-900"
												}`}
											>
												{chat.partner.name || chat.partner.email}
											</span>
											<span className="text-[9px] font-bold text-muted-foreground uppercase shrink-0">
												{formatTime(chat.lastMessageAt)}
											</span>
										</div>
										<p className="text-[10px] font-medium text-muted-foreground truncate">
											{chat.lastMessage}
										</p>
									</button>
								);
							})}
					</div>
				</div>
			</div>

			<div className="flex-1 flex flex-col overflow-hidden bg-white min-w-0">
				<div className="h-[72px] border-b border-slate-100 px-6 flex items-center justify-between bg-white shrink-0">
					<div className="flex items-center gap-3 min-w-0">
						<div className="w-9 h-9 bg-slate-950 flex items-center justify-center text-white text-sm font-black uppercase tracking-tighter shrink-0">
							{(
								activeConversation?.partner.name ||
								activeConversation?.partner.email ||
								"?"
							).charAt(0)}
						</div>
						<div className="min-w-0">
							<h2 className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none mb-1 truncate">
								{activeConversation
									? activeConversation.partner.name ||
										activeConversation.partner.email
									: "Select a conversation"}
							</h2>
							<div className="flex items-center gap-1.5">
								<div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
								<span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
									Direct Supplier
								</span>
							</div>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-none border border-slate-100 shrink-0"
					>
						<RiMore2Fill className="w-5 h-5 opacity-60" />
					</Button>
				</div>

				<div
					ref={messagesScrollRef}
					className="flex-1 min-h-0 overflow-y-auto bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px]"
				>
					<div className="max-w-3xl mx-auto space-y-6 p-6">
						{loadingHistory && (
							<div className="text-center text-[11px] text-muted-foreground uppercase tracking-[0.2em] py-8">
								Loading messages…
							</div>
						)}
						{!loadingHistory && messages.length === 0 && (
							<div className="text-center text-[11px] text-muted-foreground uppercase tracking-[0.2em] py-8">
								No messages in this conversation yet.
							</div>
						)}
						{!loadingHistory &&
							messages.map((m) => {
								const isMe =
									currentUserId != null && m.sender.id === currentUserId;
								return (
									<div
										key={m.id}
										className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
									>
										<div
											className={`max-w-[75%] p-4 border ${
												isMe
													? "bg-slate-950 text-white border-slate-950 shadow-lg shadow-slate-950/10"
													: "bg-white text-slate-900 border-slate-100 shadow-sm"
											}`}
										>
											{m.product && (
												<Link
													to="/products/$productId"
													params={{ productId: m.product.id }}
													className="mb-3 flex items-center gap-2 bg-primary/10 px-3 py-2 border border-primary/20 hover:bg-primary/20 transition-colors w-max max-w-full"
												>
													<RiBox3Line className="h-4 w-4 text-primary shrink-0" />
													<div className="flex flex-col min-w-0">
														<span className="text-[9px] font-black uppercase tracking-widest text-primary/70">
															Product Inquiry
														</span>
														<span className="text-xs font-bold text-primary truncate">
															{m.product.name}
														</span>
													</div>
												</Link>
											)}

											{m.service && (
												<Link
													to="/services/$serviceId"
													params={{ serviceId: m.service.id }}
													className="mb-3 flex items-center gap-2 bg-blue-500/10 px-3 py-2 border border-blue-500/20 hover:bg-blue-500/20 transition-colors w-max max-w-full"
												>
													<RiWrenchLine className="h-4 w-4 text-blue-600 shrink-0" />
													<div className="flex flex-col min-w-0">
														<span className="text-[9px] font-black uppercase tracking-widest text-blue-600/70">
															Service Inquiry
														</span>
														<span className="text-xs font-bold text-blue-600 truncate">
															{m.service.name}
														</span>
													</div>
												</Link>
											)}

											{m.auction && (
												<Link
													to={`/auctions/${m.auction.id}` as any}
													className="mb-3 flex items-center gap-2 bg-amber-500/10 px-3 py-2 border border-amber-500/20 hover:bg-amber-500/20 transition-colors w-max max-w-full"
												>
													<RiAuctionLine className="h-4 w-4 text-amber-600 shrink-0" />
													<div className="flex flex-col min-w-0">
														<span className="text-[9px] font-black uppercase tracking-widest text-amber-600/70">
															Auction Inquiry
														</span>
														<span className="text-xs font-bold text-amber-600 truncate">
															{m.auction.title}
														</span>
													</div>
												</Link>
											)}

											<p className="text-[13px] font-medium leading-relaxed break-words">
												{m.content}
											</p>
										</div>

										<div className="flex items-center gap-1.5 mt-1.5 opacity-40">
											<span className="text-[9px] font-bold uppercase tracking-widest">
												{formatTime(m.createdAt)}
											</span>
											{isMe && (
												<RiCheckDoubleLine className="w-3 h-3 text-emerald-500" />
											)}
										</div>
									</div>
								);
							})}
					</div>
				</div>

				<div className="shrink-0 p-4 border-t border-slate-100 bg-white">
					<div className="max-w-3xl mx-auto flex gap-3">
						<Input
							value={msg}
							onChange={(e) => setMsg(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Type your message to the supplier…"
							className="flex-1 h-12 bg-slate-50 border-slate-200 focus-visible:ring-0 focus-visible:border-primary/40 text-sm rounded-none px-5"
							disabled={!activeConversation}
						/>
						<Button
							onClick={handleSend}
							disabled={
								!activeConversation?.partner.id || !msg.trim() || sending
							}
							className="h-12 px-6 rounded-none bg-slate-950 hover:bg-slate-800 transition-colors shrink-0 shadow-lg shadow-slate-950/10"
						>
							<RiSendPlane2Fill className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
