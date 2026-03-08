import {
	RiArrowDownSLine,
	RiArrowLeftLine,
	RiArrowUpSLine,
	RiBookLine,
	RiChat1Line,
	RiFileTextLine,
	RiLifebuoyLine,
	RiMailLine,
	RiPhoneLine,
	RiQuestionLine,
	RiSearchLine,
} from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

export function HelpPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

	const categories = [
		{
			icon: RiBookLine,
			title: "Getting Started",
			description: "Account setup, verification, and platform basics",
		},
		{
			icon: RiFileTextLine,
			title: "Orders & Shipping",
			description: "Tracking, delivery times, and logistics",
		},
		{
			icon: RiChat1Line,
			title: "Supplier Relations",
			description: "Communication, quotes, and negotiations",
		},
		{
			icon: RiLifebuoyLine,
			title: "Dispute Resolution",
			description: "Returns, refunds, and conflict management",
		},
	];

	const faqs = [
		{
			question: "How do I verify my business account?",
			answer:
				"To verify your account, upload your business registration documents and tax ID in the 'Verification' section of your profile. Our team reviews all documents within 24-48 hours.",
		},
		{
			question: "What are the payment methods supported?",
			answer:
				"We support various payment methods including bank transfers, mobile money (M-Pesa, MTN Mobile Money), and major credit/debit cards. All transactions are secured by our escrow system.",
		},
		{
			question: "How does the shipping process work?",
			answer:
				"Shipping is handled through our network of verified logistics partners. Once an order is confirmed, you can track its progress in real-time from your dashboard.",
		},
		{
			question: "Can I negotiate prices with suppliers?",
			answer:
				"Yes, our platform supports direct negotiation. You can send quote requests (RFQ) to suppliers and discuss terms before finalizing any transaction.",
		},
		{
			question: "What happens if I receive damaged goods?",
			answer:
				"If you receive damaged goods, report it immediately within 24 hours through the 'Orders' page. Our dispute resolution team will investigate and facilitate a refund or replacement if the claim is valid.",
		},
	];

	return (
		<div className="min-h-screen bg-background p-4 md:p-8">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="flex items-center justify-between">
					<Link
						to="/"
						className="group flex items-center gap-2 text-foreground hover:bg-muted py-2 px-3 rounded-none transition-colors font-display font-bold uppercase text-xs tracking-widest border border-transparent hover:border-border/20"
					>
						<RiArrowLeftLine
							size={16}
							className="group-hover:-translate-x-1 transition-transform"
						/>
						Back to Home
					</Link>
				</div>

				<PageHeader
					title="Help Center"
					subtitle="How can we help you today?"
					badge="Support"
					showPattern
				/>

				<section className="bg-slate-950 py-20 border border-primary/20 rounded-none relative overflow-hidden shadow-2xl shadow-primary/5">
					<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none" />

					<div className="max-w-3xl mx-auto px-4 text-center relative z-10">
						<div className="inline-flex items-center px-4 py-1.5 bg-primary/10 text-primary rounded-none font-bold text-[10px] uppercase tracking-[0.3em] mb-8 border border-primary/30">
							<RiQuestionLine className="w-3.5 h-3.5 mr-2" />
							24/7 SUPPORT
						</div>
						<h1 className="text-4xl md:text-5xl font-display font-extrabold uppercase text-white mb-8 leading-[0.9] tracking-tighter">
							HOW CAN WE SUPPORT <br />
							<span className="text-primary italic -skew-x-12 inline-block">
								YOUR BUSINESS?
							</span>
						</h1>
						<div className="relative max-w-2xl mx-auto group">
							<RiSearchLine className="absolute left-5 top-1/2 transform -translate-y-1/2 text-primary/40 group-focus-within:text-primary w-5 h-5 transition-colors" />
							<Input
								type="text"
								placeholder="SEARCH FOR HELP..."
								value={searchQuery}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setSearchQuery(e.target.value)
								}
								className="pl-14 pr-6 h-16 bg-white/5 backdrop-blur-sm border-white/10 focus:border-primary focus:ring-0 rounded-none font-display font-bold uppercase tracking-widest text-lg shadow-2xl transition-all"
							/>
						</div>
					</div>
				</section>

				<div className="grid lg:grid-cols-3 gap-12">
					<div className="lg:col-span-2 space-y-12">
						<section>
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-2xl font-display font-extrabold uppercase text-foreground tracking-tight">
									Knowledge Base
								</h2>
								<div className="h-px bg-border/40 flex-1 ml-8"></div>
							</div>
							<div className="grid sm:grid-cols-2 gap-4">
								{categories.map((category) => (
									<div
										key={category.title}
										className="group p-8 bg-card border border-border/20 hover:border-primary/40 transition-all duration-500 cursor-pointer rounded-none relative overflow-hidden hover:shadow-2xl hover:shadow-primary/5"
									>
										<div className="absolute top-0 left-0 w-[1px] h-full bg-primary/0 group-hover:bg-primary/40 transition-all duration-500" />

										<div className="flex items-start">
											<div className="bg-muted/30 p-4 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 mr-5 rounded-none border border-border/10">
												<category.icon className="w-6 h-6" />
											</div>
											<div>
												<h3 className="font-display font-extrabold uppercase text-foreground mb-1.5 group-hover:text-primary transition-colors tracking-tight">
													{category.title}
												</h3>
												<p className="text-xs text-muted-foreground/60 leading-relaxed font-medium uppercase tracking-widest">
													{category.description}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</section>

						{/* FAQs */}
						<section>
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-2xl font-display font-extrabold uppercase text-foreground tracking-tight">
									Frequently Asked Questions
								</h2>
								<div className="h-px bg-border/40 flex-1 ml-8"></div>
							</div>
							<div className="space-y-3">
								{faqs.map((faq) => (
									<div
										key={faq.question}
										className={`border rounded-none transition-all duration-500 ${
											openFaqIndex === faqs.indexOf(faq)
												? "border-primary/40 bg-primary/5"
												: "border-border/20 bg-card hover:border-primary/20"
										}`}
									>
										<button
											type="button"
											className="w-full flex items-center justify-between p-5 text-left"
											onClick={() =>
												setOpenFaqIndex(
													openFaqIndex === faqs.indexOf(faq)
														? null
														: faqs.indexOf(faq),
												)
											}
										>
											<span className="font-display font-bold uppercase text-foreground text-base pr-4 tracking-tight">
												{faq.question}
											</span>
											{openFaqIndex === faqs.indexOf(faq) ? (
												<RiArrowUpSLine className="w-5 h-5 text-primary flex-shrink-0" />
											) : (
												<RiArrowDownSLine className="w-5 h-5 text-muted-foreground flex-shrink-0" />
											)}
										</button>
										<div
											className={`overflow-hidden transition-all duration-500 ease-in-out ${
												openFaqIndex === faqs.indexOf(faq)
													? "max-h-60 opacity-100"
													: "max-h-0 opacity-0"
											}`}
										>
											<div className="p-6 pt-0 text-sm text-muted-foreground/80 leading-relaxed border-t border-primary/10 font-medium">
												{faq.answer}
											</div>
										</div>
									</div>
								))}
							</div>
						</section>
					</div>

					<div className="space-y-8">
						<div className="bg-muted/10 border border-border/20 p-8 rounded-none relative overflow-hidden">
							<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full pointer-events-none" />
							<h3 className="text-lg font-display font-extrabold uppercase text-foreground mb-4 flex items-center tracking-tight">
								<RiPhoneLine className="w-4 h-4 mr-2.5 text-primary" />
								Contact Us
							</h3>
							<p className="text-xs text-muted-foreground/60 mb-8 leading-relaxed font-medium uppercase tracking-widest">
								Our support team is standing by to help you.
							</p>
							<div className="space-y-3">
								<Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-extrabold uppercase tracking-widest rounded-none justify-start px-6 h-14 border border-primary/20 shadow-none">
									<RiPhoneLine className="w-4 h-4 mr-4" />
									+254 700 000 000
								</Button>
								<Button
									variant="outline"
									className="w-full border-border/40 bg-transparent hover:bg-foreground hover:text-background font-display font-extrabold uppercase tracking-widest rounded-none justify-start px-6 h-14 transition-all"
								>
									<RiMailLine className="w-4 h-4 mr-4" />
									support@afriamarket.com
								</Button>
							</div>
						</div>

						<div className="bg-card border border-border/20 p-8 relative overflow-hidden group rounded-none">
							<div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100%] -mr-12 -mt-12 pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
							<h3 className="text-lg font-display font-extrabold uppercase text-foreground mb-4 tracking-tight">
								Guides
							</h3>
							<p className="text-xs text-muted-foreground/60 mb-8 leading-relaxed font-medium uppercase tracking-widest">
								Helpful guides for using the platform.
							</p>
							<ul className="space-y-4">
								{[
									"Supplier Handbook",
									"API Documentation",
									"Trade Guidelines",
								].map((item) => (
									<li
										key={item}
										className="flex items-center text-xs font-bold text-foreground/70 hover:text-primary transition-colors cursor-pointer group/item uppercase tracking-widest"
									>
										<RiFileTextLine className="w-4 h-4 mr-3 text-muted-foreground/40 group-hover/item:text-primary transition-colors" />
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
