import { RiBuilding2Line, RiNotification3Line } from "@remixicon/react";
import { Lock, Save, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card as AdminCard } from "@/shared/components/admin/card";
import { CompanyInfoSection } from "./settings/company-info-section";
import { NotificationsSection } from "./settings/notifications-section";
import { ProfileInfoSection } from "./settings/profile-info-section";
import { SecuritySection } from "./settings/security-section";
import type { Company } from "@/types";

interface ProfileSettingsProps {
  supplierData: Company | null;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ supplierData }) => {
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    fullName:
      (supplierData as unknown as { contactPerson?: string })?.contactPerson ||
      "John Habimana",
    email: supplierData?.email || "john@karibu.com",
    phone: supplierData?.phone || "+250 788 123 456",
    position:
      (supplierData as unknown as { position?: string })?.position ||
      "Sales Manager",
    avatar:
      (supplierData as unknown as { avatar?: string })?.avatar || "/logo.svg",
  });

  const [companyData] = useState({
    companyName: supplierData?.name || "AfroTech Imports",
    description:
      supplierData?.description ||
      "Direct importer of construction hardware and specialized industrial components serving East Africa.",
    type: supplierData?.type || "MANUFACTURER_RWANDA",
    location:
      (supplierData as unknown as { location?: string })?.location ||
      "Kigali, Rwanda",
    address: "123 Business District, Kigali, Rwanda",
    website: "https://afri-market-rep.vercel.app",
    coverImage:
      (supplierData as unknown as { coverImage?: string })?.coverImage ||
      "/logo.svg",
    specialties: (supplierData as unknown as { specialties?: string[] })
      ?.specialties || ["Electronics", "Mobile Phones", "Computers"],
  });

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "company", label: "Company Info", icon: RiBuilding2Line },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: RiNotification3Line },
  ];

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Tabs */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="bg-background border border-border/40 rounded-none overflow-hidden">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all text-left border-b border-border last:border-0",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted/50",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1">
        <AdminCard
          title={activeTabData?.label}
          subtitle="Update your account settings"
          headerActions={
            <Button
              size="sm"
              className="font-heading font-bold uppercase text-[10px] tracking-widest h-9 px-4 shadow-none rounded-sm"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes
            </Button>
          }
        >
          {activeTab === "profile" && (
            <ProfileInfoSection data={profileData} onChange={setProfileData} />
          )}

          {activeTab === "company" && <CompanyInfoSection data={companyData} />}

          {activeTab === "security" && <SecuritySection />}

          {activeTab === "notifications" && <NotificationsSection />}
        </AdminCard>
      </div>
    </div>
  );
};

export default ProfileSettings;
