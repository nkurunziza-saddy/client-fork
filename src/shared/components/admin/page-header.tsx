import type React from "react";
import { PageHeader as UIHeader } from "@/components/ui/page-header";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	badge?: string;
	actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	subtitle,
	badge,
	actions,
}) => {
	return (
		<UIHeader
			title={title}
			subtitle={subtitle}
			badge={badge}
			actions={actions}
			showPattern
		/>
	);
};
