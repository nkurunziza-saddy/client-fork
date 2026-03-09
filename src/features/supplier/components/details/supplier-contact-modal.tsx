import { Mail, MessageSquare, Phone } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/shared/components/responsive-modal";
import type { Company } from "@/types";

interface SupplierContactModalProps {
  company: Company;
  message: string;
  setMessage: (val: string) => void;
  sendingInquiry: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export const SupplierContactModal: React.FC<SupplierContactModalProps> = ({
  company,
  message,
  setMessage,
  sendingInquiry,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const contactMethods = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: company.phone || "Not available",
      actionLabel: "Call Now",
      disabled: !company.phone,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: company.email || "Not available",
      actionLabel: "Send Email",
      disabled: !company.email,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Marketplace Chat",
      value: "Average response: 2h",
      actionLabel: "Start Chat",
      disabled: false,
    },
  ];

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={onClose}
      className="p-0 overflow-hidden"
    >
      <div className="flex flex-col h-full max-h-[80vh]">
        <div className="p-4 sm:p-8 space-y-4 bg-white overflow-y-auto">
          <div className="space-y-1 mb-6">
            <h2 className="font-display font-black uppercase text-2xl tracking-tighter">
              Contact Supplier
            </h2>
            <p className="text-xs uppercase font-bold tracking-widest opacity-60">
              {company.name}
            </p>
          </div>
          {contactMethods.map((method, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 border border-slate-100 ${
                method.disabled ? "opacity-50" : "hover:bg-slate-50"
              } transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600">
                  {method.icon}
                </div>
                <div>
                  <span className="text-[9px] block uppercase font-bold text-muted-foreground tracking-widest mb-0.5">
                    {method.label}
                  </span>
                  <span className="text-xs font-black text-slate-900 leading-none">
                    {method.value}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={method.disabled}
                className="rounded-none h-8 text-[9px] font-black uppercase tracking-widest px-4 border-slate-300"
              >
                {method.actionLabel}
              </Button>
            </div>
          ))}
        </div>

        <div className="px-4 sm:px-8 pb-8 pt-4 bg-white space-y-3 mt-auto border-t border-border/10">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-32 p-4 border border-slate-200 rounded-none text-sm focus:ring-1 focus:ring-primary outline-none"
          />
          <Button
            onClick={onSubmit}
            disabled={sendingInquiry || !message.trim()}
            className="w-full rounded-none h-12 text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-950"
          >
            {sendingInquiry ? "Sending..." : "Send Message"}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full rounded-none h-12 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Close
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
};
