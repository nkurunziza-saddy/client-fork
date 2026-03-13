import {
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiFlashlightLine,
} from "@remixicon/react";
import { Package } from "lucide-react";

interface SupplierAssignedService {
  id: string;
  name: string;
  description: string;
  assignedDate: string;
  status: "active" | "inactive";
}

interface SupplierOwnedProduct {
  id: string;
  name: string;
  category: string;
  status: "active" | "inactive" | "pending-review";
  createdDate: string;
  inquiries: number;
  views: number;
}

/**
 * Component that can be integrated into the Supplier Dashboard
 * Shows suppliers their assigned services and products
 */
export default function SupplierServicesAndProducts() {
  // Mock data - would be fetched from API with supplier ID
  const assignedServices: SupplierAssignedService[] = [
    {
      id: "1",
      name: "Express Delivery",
      description: "Fast delivery within 24-48 hours",
      assignedDate: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Payment Processing",
      description: "Secure payment gateway integration",
      assignedDate: "2024-01-10",
      status: "active",
    },
  ];

  const ownedProducts: SupplierOwnedProduct[] = [
    {
      id: "1",
      name: "Industrial Pump Series 200",
      category: "Construction",
      status: "pending-review",
      createdDate: "2024-01-20",
      inquiries: 8,
      views: 125,
    },
    {
      id: "2",
      name: "Solar Panel 500W",
      category: "Electronics",
      status: "active",
      createdDate: "2024-01-15",
      inquiries: 34,
      views: 542,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Assigned Services Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <RiFlashlightLine size={24} className="text-primary" />
            Your Assigned Services
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Services you are allowed to offer on the platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedServices.map((service) => (
            <div
              key={service.id}
              className="bg-card rounded-sm shadow-none p-6 border border-border hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-heading font-bold uppercase text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <RiCheckboxCircleLine size={20} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <RiCalendarLine size={14} />
                  Assigned: {service.assignedDate}
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-sm uppercase tracking-wider">
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Products Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package size={24} className="text-success" />
            Your Products
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Products you have created and published on the platform
          </p>
        </div>

        {ownedProducts.length > 0 ? (
          <div className="bg-card rounded-sm shadow-none border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-foreground tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-foreground tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-foreground tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-foreground tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-foreground tracking-wider">
                    Inquiries
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-foreground tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ownedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-muted/50 transition-all text-sm"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/10 rounded-sm border border-success/20">
                          <Package size={16} className="text-success" />
                        </div>
                        <span className="font-heading font-bold text-foreground uppercase">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm border ${
                          product.status === "active"
                            ? "bg-success/10 text-success border-success/20"
                            : product.status === "pending-review"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {product.status === "pending-review"
                          ? "Pending Review"
                          : product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {product.views}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {product.inquiries}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.createdDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-card rounded-sm shadow-none p-8 text-center border border-border">
            <Package size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products created yet</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-success hover:bg-success/90 text-success-foreground rounded-sm transition-all font-bold uppercase tracking-wide"
            >
              Create Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Integration Tips */}
      <div className="bg-info/10 rounded-sm p-6 border border-info/30">
        <h3 className="font-bold text-info mb-2 uppercase tracking-wide text-xs">
          💡 Integration Note
        </h3>
        <p className="text-sm text-info">
          This component can be integrated into your existing Supplier Dashboard
          page. It shows suppliers their assigned services and the products they
          have created, providing complete visibility into their platform
          activity.
        </p>
      </div>
    </div>
  );
}
