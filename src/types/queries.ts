import type {
  Auction,
  AuctionStatus,
  Company,
  CompanyCategory,
  Message,
  Product,
  ProductCategory,
  Review,
  Service,
  ServiceCategory,
} from "./models";

export interface CompaniesQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  categoryId?: string;
  district?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  minRating?: number;
  isVerified?: boolean;
}

export interface CompaniesListResult {
  data: Company[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  categoryId?: string;
  companyId?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  companyType?: string;
  isFeatured?: boolean;
  hasDiscount?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface ProductsListResult {
  data: Product[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ServicesQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  categoryId?: string;
  companyId?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  companyType?: string;
  isFeatured?: boolean;
  hasDiscount?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface ServicesListResult {
  data: Service[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ProductCategoriesListResult {
  data: ProductCategory[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ServiceCategoriesListResult {
  data: ServiceCategory[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CompanyCategoriesListResult {
  data: CompanyCategory[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AuctionsQueryParams {
  page?: number;
  limit?: number;
  status?: AuctionStatus;
  companyId?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface AuctionsListResult {
  data: Auction[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ReviewsResponse {
  items: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChatHistoryResult {
  items: Message[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CreateProductVariantInput {
  name: string;
  sku?: string;
  price: number;
  stock: number;
  unit?: string;
  images?: string[];
}

export interface CreateProductInput {
  name: string;
  description?: string;
  priceType?: "FIXED" | "NEGOTIABLE" | "STARTS_AT";
  price?: number;
  stock?: number;
  unit?: string;
  images?: string[];
  categoryId: string;
  companyId: string;
  variants?: {
    name: string;
    sku?: string;
    price: number;
    stock: number;
    unit?: string;
    images?: string[];
  }[];
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  priceType?: "FIXED" | "NEGOTIABLE" | "STARTS_AT";
  price?: number;
  duration?: string;
  discount?: number;
  categoryId: string;
  companyId: string;
  images?: string[];
}

export interface CreateAuctionInput {
  title: string;
  description?: string;
  startingPrice: number;
  images?: string[];
  startDate: string | Date;
  endDate: string | Date;
  companyId: string;
}

export interface CreateCompanyInput {
  name: string;
  description?: string;
  type?: string;
  category?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface CreateProductCategoryInput {
  name: string;
  description?: string;
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
  productId?: string;
  serviceId?: string;
  companyId?: string;
}

export interface UpdateProfileInput {
  name?: string;
  phoneNumber?: string;
  image?: string;
}

export interface WishlistResponse {
  products: Product[];
  services: Service[];
  companies?: Company[];
  auctions?: Auction[];
}

export type WishlistItem =
  | (Product & { type: "product"; itemType: "PRODUCT" })
  | (Service & { type: "service"; itemType: "SERVICE" })
  | (Auction & { type: "auction"; itemType: "AUCTION" })
  | (Company & { type: "company"; itemType: "COMPANY" })
  | {
      id: string;
      type: "product" | "service" | "auction" | "company";
      itemType?: "PRODUCT" | "SERVICE" | "AUCTION" | "COMPANY";
      createdAt?: string;
    };
