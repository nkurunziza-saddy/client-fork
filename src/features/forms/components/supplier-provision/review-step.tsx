import { RiCheckboxCircleLine } from "@remixicon/react";
import type React from "react";
import { Card as AdminCard } from "@/shared/components/admin/card";

interface ReviewStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // biome-ignore lint/suspicious/noExplicitAny: generic bypass
  form: any;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ form }) => {
  return (
    <AdminCard
      title="Final Review"
      subtitle="Review your information before submitting"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-muted/30 p-6 border border-border border-dashed rounded-sm">
            <h3 className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/20 pb-2">
              Company Information
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-muted-foreground text-[9px] uppercase font-black tracking-widest block mb-1">
                  Company Name
                </span>
                <span className="font-bold text-sm uppercase">
                  {form.getFieldValue("companyName")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[9px] uppercase font-black tracking-widest block mb-1">
                  TIN Number
                </span>
                <span className="font-mono text-sm font-black">
                  {form.getFieldValue("registrationId")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[9px] uppercase font-black tracking-widest block mb-1">
                  Location
                </span>
                <span className="font-bold text-sm uppercase">
                  {form.getFieldValue("district")},{" "}
                  {form.getFieldValue("location")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-6 border border-border border-dashed rounded-sm">
            <h3 className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/20 pb-2">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-muted-foreground text-[9px] uppercase font-black tracking-widest block mb-1">
                  Full Name
                </span>
                <span className="font-bold text-sm uppercase">
                  {form.getFieldValue("fullName")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[9px] uppercase font-black tracking-widest block mb-1">
                  Email Address
                </span>
                <span className="font-mono text-sm font-black lowercase">
                  {form.getFieldValue("email")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-[9px] uppercase font-black tracking-widest block mb-1">
                  Job Title
                </span>
                <span className="font-bold text-sm uppercase">
                  {form.getFieldValue("position") || "NOT SPECIFIED"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-success/5 border border-success/20 p-6 rounded-sm flex items-start gap-4">
          <div className="p-2 bg-success/10 rounded-sm">
            <RiCheckboxCircleLine className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-sm font-heading font-bold text-success uppercase tracking-widest">
              Ready to Register
            </p>
            <p className="text-[10px] text-success/80 mt-1 uppercase font-bold tracking-wider leading-relaxed">
              Your company is ready to be registered. Once submitted, you will
              be able to manage your profile and listings.
            </p>
          </div>
        </div>
      </div>
    </AdminCard>
  );
};
