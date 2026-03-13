import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileInfoSectionProps {
  data: {
    fullName: string;
    email: string;
    phone: string;
    position: string;
    avatar: string;
  };
  onChange: (data: {
    fullName: string;
    email: string;
    phone: string;
    position: string;
    avatar: string;
  }) => void;
}

export function ProfileInfoSection({
  data,
  onChange,
}: ProfileInfoSectionProps) {
  return (
    <div className="space-y-10">
      {/* Avatar */}
      <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-muted/20 border border-border border-dashed rounded-sm">
        <div className="relative shrink-0">
          <img
            src={data.avatar}
            alt="Profile"
            className="w-28 h-28 rounded-sm object-cover border border-background shadow-none"
            onError={(e) => {
              e.currentTarget.src = "/image-fallback.svg";
            }}
          />
          <button
            type="button"
            className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2.5 rounded-sm hover:scale-110 transition-transform shadow-none border border-background"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center sm:text-left flex-1">
          <h4 className="font-heading font-bold text-foreground uppercase tracking-wider mb-1">
            Profile Photo
          </h4>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-4">
            Maximum size: 2MB • Format: JPG, PNG
          </p>
          <Button
            variant="outline"
            size="sm"
            className="font-heading font-bold uppercase text-[10px] tracking-widest h-9 px-4 border border-border hover:bg-muted shadow-none rounded-sm"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" /> Update Image
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Full Name
          </label>
          <Input
            value={data.fullName}
            onChange={(e) =>
              onChange({
                ...data,
                fullName: e.target.value,
              })
            }
            className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Job Position
          </label>
          <Input
            value={data.position}
            onChange={(e) =>
              onChange({
                ...data,
                position: e.target.value,
              })
            }
            className="h-12 bg-muted/10 font-bold uppercase tracking-wider shadow-none border-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Email Address
          </label>
          <Input
            value={data.email}
            disabled
            className="h-12 bg-muted/20 font-mono text-xs font-bold shadow-none border-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Phone Number
          </label>
          <Input
            value={data.phone}
            onChange={(e) =>
              onChange({
                ...data,
                phone: e.target.value,
              })
            }
            className="h-12 bg-muted/10 font-mono text-xs font-bold shadow-none border-border"
          />
        </div>
      </div>
    </div>
  );
}
