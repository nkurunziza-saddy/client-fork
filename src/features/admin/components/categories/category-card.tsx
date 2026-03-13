import {
  RiCarLine,
  RiDeleteBinLine,
  RiEditLine,
  RiEyeLine,
  RiFolderOpenLine,
  RiHeartLine,
  RiHomeLine,
  RiSettingsLine,
  RiSmartphoneLine,
  RiTShirtLine,
} from "@remixicon/react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card as AdminCard } from "@/features/admin/components/card";

interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  productCount: number;
  subcategories?: any[];
  status: string;
}

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const iconMap: { [key: string]: any } = {
  Smartphone: RiSmartphoneLine,
  Shirt: RiTShirtLine,
  Home: RiHomeLine,
  Heart: RiHeartLine,
  Car: RiCarLine,
  Settings: RiSettingsLine,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const IconComponent = iconMap[category.icon] || RiFolderOpenLine;

  return (
    <AdminCard
      noPadding
      className="hover:border-primary/40 transition-all duration-500 flex flex-col group/card shadow-sm hover:shadow-2xl rounded-none overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/0 group-hover/card:bg-primary/40 transition-all duration-500" />
      <div className="p-5 border-b border-border/40 bg-muted/5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/5 rounded-none border border-primary/10 group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-all duration-500">
              <IconComponent
                size={20}
                className="text-primary group-hover/card:text-primary-foreground transition-colors"
              />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm text-foreground tracking-tight uppercase leading-none">
                {category.name}
              </h3>
              <p className="text-[9px] text-muted-foreground/40 mt-1 font-bold uppercase tracking-widest">
                ID: {category.id.substring(0, 8)}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`rounded-none border font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 ${
              category.status === "active"
                ? "bg-success/5 text-success border-success/10"
                : "bg-destructive/5 text-destructive border-destructive/10"
            }`}
          >
            {category.status}
          </Badge>
        </div>
      </div>

      <div className="p-5 flex-1">
        <p className="text-sm text-muted-foreground/80 font-normal leading-relaxed line-clamp-2">
          {category.description || "No description provided for this category."}
        </p>
      </div>

      <div className="px-5 py-5 bg-muted/10 grid grid-cols-2 gap-6 text-center border-y border-border/40">
        <div className="space-y-1">
          <p className="text-xl font-display font-black text-foreground">
            {category.productCount}
          </p>
          <p className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-widest">
            Products
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xl font-display font-black text-foreground">
            {category.subcategories?.length || 0}
          </p>
          <p className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-widest">
            Items
          </p>
        </div>
      </div>

      <div className="px-5 py-4 flex items-center justify-between mt-auto bg-background/50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="p-2 h-9 w-9 hover:bg-muted rounded-none transition-all text-muted-foreground border border-border/40 flex items-center justify-center group/edit"
            title="Edit"
          >
            <RiEditLine
              size={14}
              className="group-hover/edit:text-primary transition-colors"
            />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="p-2 h-9 w-9 hover:bg-muted rounded-none transition-all text-muted-foreground border border-border/40 flex items-center justify-center group/del"
            title="Delete"
          >
            <RiDeleteBinLine
              size={14}
              className="group-hover/del:text-destructive transition-colors"
            />
          </button>
        </div>
        <button
          type="button"
          className="h-9 px-4 hover:bg-primary hover:text-primary-foreground rounded-none transition-all text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/20 hover:border-primary flex items-center gap-2 group/view"
        >
          <RiEyeLine
            size={14}
            className="group-hover/view:scale-110 transition-transform"
          />
          Explore
        </button>
      </div>
    </AdminCard>
  );
};
