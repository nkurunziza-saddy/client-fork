export interface SEOOptions {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?: string;
	keywords?: string[];
	jsonLd?: Record<string, unknown>;
	canonical?: string;
}

export function createSeoMeta(options: SEOOptions) {
	const {
		title,
		description,
		image = "/enhanced_gpt.png",
		url = "https://afri-market-rep.vercel.app",
		type = "website",
		keywords,
		jsonLd,
		canonical,
	} = options;

	const meta: (
		| Record<string, string | Record<string, unknown>>
		| { title: string }
	)[] = [];
	const links: Record<string, string>[] = [];

	if (title) {
		meta.push({ title: `${title} | Karibu` });
		meta.push({ property: "og:title", content: title });
		meta.push({ name: "twitter:title", content: title });
	}

	if (description) {
		meta.push({ name: "description", content: description });
		meta.push({ property: "og:description", content: description });
		meta.push({ name: "twitter:description", content: description });
	}

	if (image) {
		const absoluteImage = image.startsWith("http")
			? image
			: `${url}${image.startsWith("/") ? "" : "/"}${image}`;
		meta.push({ property: "og:image", content: absoluteImage });
		meta.push({ name: "twitter:image", content: absoluteImage });
		meta.push({ name: "twitter:card", content: "summary_large_image" });
	}

	if (url) {
		meta.push({ property: "og:url", content: url });
	}

	if (type) {
		meta.push({ property: "og:type", content: type });
	}

	if (keywords && keywords.length > 0) {
		meta.push({ name: "keywords", content: keywords.join(", ") });
	}

	if (jsonLd) {
		meta.push({ "script:ld+json": jsonLd });
	}

	if (canonical) {
		links.push({ rel: "canonical", href: canonical });
	} else if (url) {
		links.push({ rel: "canonical", href: url });
	}

	return { meta, links };
}
