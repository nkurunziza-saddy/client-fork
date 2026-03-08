import { format } from "date-fns";
import {
	ChevronLeft,
	Loader2,
	MessageSquare,
	MoreVertical,
	Paperclip,
	Phone,
	Search,
	Send,
	Smile,
	Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, handleRtkQueryError } from "@/lib/utils";
import {
	useGetChatHistoryQuery,
	useGetConversationsQuery,
	useSendMessageMutation,
} from "@/services/api/messages";
import type { RootState } from "@/store";

interface MessageCenterProps {
	role: "user" | "provider";
}

const MessageCenter: React.FC<MessageCenterProps> = ({ role: _role }) => {
	const user = useSelector((state: RootState) => state.auth.user);
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [messageText, setMessageText] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const { data: conversations, isLoading: isLoadingConversations } =
		useGetConversationsQuery();

	const { data: chatHistory, isLoading: isLoadingHistory } =
		useGetChatHistoryQuery(
			{ partnerId: activeChatId ?? "" },
			{ skip: !activeChatId },
		);

	const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

	const activeChat = conversations?.find((c) => c.partner.id === activeChatId);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (chatHistory?.items) {
			scrollToBottom();
		}
	}, [chatHistory?.items, scrollToBottom]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageText.trim() || !activeChatId || isSending) return;

		try {
			const text = messageText;
			setMessageText(""); // Clear immediately for UX
			await sendMessage({
				receiverId: activeChatId,
				content: text,
			}).unwrap();
		} catch (err) {
			setMessageText(messageText); // Restore on error
			handleRtkQueryError(err, "Failed to send message");
		}
	};

	return (
		<div className="flex h-full bg-background border border-border rounded-sm overflow-hidden shadow-2xl">
			{/* Sidebar */}
			<div
				className={cn(
					"w-full md:w-80 lg:w-96 border-r-2 border-border flex flex-col bg-muted/10 shrink-0",
					activeChatId && "hidden md:flex",
				)}
			>
				<div className="p-6 border-b-2 border-border bg-background shrink-0">
					<h2 className="text-xl font-heading font-bold uppercase tracking-widest text-foreground mb-4">
						Messages
					</h2>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input
							placeholder="Search chats..."
							className="pl-10 h-11 bg-muted/20 border border-border uppercase text-[10px] font-bold tracking-widest shadow-none"
						/>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto">
					{isLoadingConversations ? (
						<div className="flex items-center justify-center h-full p-8">
							<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
						</div>
					) : conversations?.length === 0 ? (
						<div className="p-8 text-center text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
							No messages found
						</div>
					) : (
						conversations?.map((conv) => (
							<button
								key={conv.partner.id}
								onClick={() => setActiveChatId(conv.partner.id)}
								className={cn(
									"w-full p-4 flex items-start gap-4 hover:bg-muted/50 transition-all border-b-2 border-border/50 group text-left",
									activeChatId === conv.partner.id
										? "bg-background border-l-4 border-l-primary"
										: "border-l-4 border-l-transparent",
								)}
							>
								<div className="relative shrink-0">
									<Avatar className="h-12 w-12 rounded-sm border border-border shadow-md">
										<AvatarImage src={conv.partner.image} />
										<AvatarFallback className="font-heading font-bold">
											{conv.partner.name?.charAt(0) ||
												conv.partner.email.charAt(0)}
										</AvatarFallback>
									</Avatar>
									{/* Status marker could be dynamic if API supported it */}
									<div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border border-background" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start mb-1">
										<span className="font-heading font-bold text-foreground text-sm uppercase truncate">
											{conv.partner.name}
										</span>
										<span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest shrink-0">
											{conv.lastMessageAt
												? format(new Date(conv.lastMessageAt), "HH:mm")
												: ""}
										</span>
									</div>
									<p className="text-xs text-muted-foreground truncate font-medium uppercase tracking-tight">
										{conv.lastMessage}
									</p>
								</div>
							</button>
						))
					)}
				</div>
			</div>

			{/* Main Chat Area */}
			<div
				className={cn(
					"flex-1 flex flex-col bg-background relative min-w-0",
					!activeChatId && "hidden md:flex",
				)}
			>
				{activeChatId ? (
					<>
						<div className="h-20 border-b-2 border-border px-6 flex items-center justify-between bg-background/80 backdrop-blur-md relative z-10 shrink-0">
							<div className="flex items-center gap-4">
								<Button
									variant="ghost"
									size="icon"
									className="md:hidden"
									onClick={() => setActiveChatId(null)}
								>
									<ChevronLeft className="w-5 h-5" />
								</Button>
								<div className="flex items-center gap-3">
									<Avatar className="h-10 w-10 rounded-sm border border-border">
										<AvatarImage src={activeChat?.partner.image} />
										<AvatarFallback className="font-heading font-bold">
											{activeChat?.partner.name?.charAt(0) ||
												activeChat?.partner.email.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-heading font-bold text-foreground text-sm uppercase tracking-widest">
											{activeChat?.partner.name}
										</div>
										<div className="flex items-center text-success text-[10px] font-black uppercase tracking-[0.2em]">
											<div className="w-1.5 h-1.5 bg-success rounded-full mr-1.5 animate-pulse" />
											Online
										</div>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="icon"
									className="h-10 w-10 border border-border rounded-sm hover:border-primary"
								>
									<Phone className="w-4 h-4 text-muted-foreground" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="h-10 w-10 border border-border rounded-sm hover:border-primary"
								>
									<Video className="w-4 h-4 text-muted-foreground" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="h-10 w-10 border border-border rounded-sm hover:border-primary"
								>
									<MoreVertical className="w-4 h-4 text-muted-foreground" />
								</Button>
							</div>
						</div>

						<div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5 relative min-h-0">
							<div className="absolute inset-0 african-pattern opacity-5 pointer-events-none" />
							{isLoadingHistory ? (
								<div className="flex items-center justify-center h-full">
									<Loader2 className="w-8 h-8 animate-spin text-primary" />
								</div>
							) : (
								chatHistory?.items.map((msg) => {
									const isOwn = msg.sender.id === user?.id;
									return (
										<div
											key={msg.id}
											className={cn(
												"flex",
												isOwn ? "justify-end" : "justify-start",
											)}
										>
											<div
												className={cn(
													"max-w-[80%] lg:max-w-[60%] rounded-sm p-4 relative border",
													isOwn
														? "bg-foreground text-background border-foreground shadow-xl"
														: "bg-background text-foreground border-border",
												)}
											>
												<p
													className={cn(
														"text-sm font-medium leading-relaxed",
														isOwn ? "" : "font-mono italic",
													)}
												>
													{msg.content}
												</p>
												<div
													className={cn(
														"text-[8px] font-black uppercase tracking-widest mt-2",
														isOwn
															? "text-background/60 text-right"
															: "text-muted-foreground",
													)}
												>
													{format(new Date(msg.createdAt), "HH:mm")}
												</div>
											</div>
										</div>
									);
								})
							)}
							<div ref={messagesEndRef} />
						</div>

						<div className="p-6 border-t-2 border-border bg-background shrink-0">
							<form
								className="flex items-center gap-3"
								onSubmit={handleSendMessage}
							>
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="h-12 w-12 border border-border rounded-sm hover:bg-muted shrink-0"
								>
									<Paperclip className="w-5 h-5 text-muted-foreground" />
								</Button>
								<div className="relative flex-1">
									<Input
										value={messageText}
										onChange={(e) => setMessageText(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												handleSendMessage(e);
											}
										}}
										placeholder="Write a message..."
										className="h-12 bg-muted/10 border border-border rounded-sm px-4 pr-12 font-bold uppercase text-xs tracking-wider shadow-none focus:bg-background"
										disabled={isSending}
									/>
									<button
										type="button"
										className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
									>
										<Smile className="w-5 h-5" />
									</button>
								</div>
								<Button
									className="h-12 px-6 rounded-sm font-heading font-bold uppercase tracking-widest shadow-lg shadow-primary/20 shrink-0"
									disabled={isSending || !messageText.trim()}
								>
									{isSending ? (
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									) : (
										<Send className="w-4 h-4 mr-2" />
									)}
									Send
								</Button>
							</form>
						</div>
					</>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-muted/5">
						<div className="absolute inset-0 african-pattern opacity-10 pointer-events-none" />
						<div className="w-20 h-20 bg-muted/20 border-4 border-border rounded-sm flex items-center justify-center mb-6 relative z-10 shadow-xl">
							<MessageSquare className="w-10 h-10 text-muted-foreground/40" />
						</div>
						<h3 className="text-2xl font-heading font-bold text-foreground uppercase tracking-widest mb-2 relative z-10">
							No Chat Selected
						</h3>
						<p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] max-w-xs leading-loose relative z-10">
							Select a person from the sidebar to start a conversation
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default MessageCenter;
