export interface CompanyCategoryRef {
  id: string;
  name: string;
  description?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  ownerId?: string;
  user?: { id: string; name?: string; email?: string };
  description?: string;
  logoUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  averageRating: number;
  reviewCount: number;
  visits: number;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  type: string;
  category: CompanyCategoryRef;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategoryRef {
  id: string;
  name: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  discount?: number;
  unit?: string;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  priceType: "FIXED" | "NEGOTIABLE" | "STARTS_AT";
  isActive: boolean;
  isFeatured?: boolean;
  views: number;
  category: ProductCategoryRef;
  company: CompanyRef;
  price?: number;
  stock?: number;
  unit?: string;
  images?: string[];
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyRef {
  id: string;
  name: string;
  slug?: string;
  district?: string;
  isVerified?: boolean;
  type?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  logo?: string;
  rating?: number;
  joinedAt?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  priceType: "FIXED" | "NEGOTIABLE" | "STARTS_AT";
  price?: number;
  duration?: string;
  discount?: number;
  isActive: boolean;
  isFeatured?: boolean;
  views?: number;
  category: ProductCategoryRef;
  company: CompanyRef;
  images?: string[];
  totalRequests?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AuctionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Auction {
  id: string;
  title: string;
  description?: string;
  startingPrice: number;
  images?: string[];
  status: AuctionStatus;
  startDate: string;
  endDate: string;
  views?: number;
  bidsCount?: number;
  company: CompanyRef;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user?: { id: string; name: string; email: string };
  productId?: string;
  companyId?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  sender: { id: string; name?: string; email: string };
  receiver: { id: string; name?: string; email: string };
  product?: { id: string; name: string };
  service?: { id: string; name: string };
  auction?: { id: string; title: string };
}

export interface ConversationPartner {
  partner: { id: string; name?: string; email: string; image?: string };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyCategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketplaceStats {
  verifiedSuppliers: number;
  productsListed: number;
  districtsCovered: number;
  activeContractors: number;
}

export interface Supplier {
  id: string;
  name: string;
  description: string;
  location: string;
  country: string;
  avatar: string;
  coverImage: string;
  gallery?: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  specialties: string[];
  contact: {
    email: string;
    phone: string;
    whatsapp?: string;
  };
  services: {
    shipping: string[];
    paymentMethods: string[];
    minimumOrder: string;
    deliveryTime: string;
  };
  totalProducts: number;
  joinedDate: string;
}

export type InteractionType =
  | "VIEW"
  | "WHATSAPP_CLICK"
  | "CALL_CLICK"
  | "EMAIL_CLICK"
  | "SHARE";

export interface LogInteractionPayload {
  type: InteractionType;
  serviceId?: string;
  productId?: string;
  companyId?: string;
  metadata?: Record<string, unknown>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  company?: { id: string; name: string };
}

export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
    byRole: Record<string, number>;
  };
  companies: {
    total: number;
    active: number;
    verified: number;
    byCategory: { name: string; count: number }[];
  };
  products: {
    total: number;
    active: number;
  };
  services: {
    total: number;
    active: number;
  };
  reviews: {
    total: number;
    /**
     * Average rating string formatted to 2 decimal places on the backend.
     */
    averageRating: string;
  };
}

export interface ProviderCompanyStats {
  id: string;
  name: string;
  overview: {
    visits: number;
    reviews: number;
    rating: number;
  };
  interactions: {
    views: number;
    whatsappClicks: number;
    callClicks: number;
    emailClicks: number;
    shares: number;
  };
  inventory: {
    products: {
      count: number;
      views: number;
    };
    services: {
      count: number;
      views: number;
    };
  };
}

export interface ProviderStats {
  overview: {
    totalViews: number;
    totalReviews: number;
    averageRating: number;
    companiesCount: number;
    totalInteractions: number;
  };
  companies: ProviderCompanyStats[];
}
