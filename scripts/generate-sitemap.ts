import fs from "fs";
import path from "path";

const BASE_URL =
  process.env.VITE_APP_URL || "https://afri-market-rep.vercel.app";
const API_URL =
  `${process.env.VITE_API_URL}/api` || "http://localhost:3000/api";

const STATIC_ROUTES = [
  "",
  "/about",
  "/products",
  "/suppliers",
  "/categories",
  "/auctions",
  "/help",
  "/auth/signin",
  "/auth/signup",
];

async function getDynamicRoutes() {
  const routes: string[] = [];

  console.log(`Attempting to fetch dynamic routes from: ${API_URL}`);

  try {
    // Fetch products
    const productsRes = await fetch(`${API_URL}/products?limit=100`);
    if (!productsRes.ok) {
      console.warn(
        `⚠️  [Sitemap Warning]: Failed to fetch products (${productsRes.status}). Skipping dynamic product routes.`,
      );
    } else {
      const productsData = await productsRes.json();
      if (productsData.data) {
        productsData.data.forEach((p: any) => {
          routes.push(`/products/${p.id}`);
        });
      }
    }

    // Fetch suppliers
    const suppliersRes = await fetch(`${API_URL}/companies?limit=100`);
    if (!suppliersRes.ok) {
      console.warn(
        `⚠️  [Sitemap Warning]: Failed to fetch suppliers (${suppliersRes.status}). Skipping dynamic supplier routes.`,
      );
    } else {
      const suppliersData = await suppliersRes.json();
      if (suppliersData.data) {
        suppliersData.data.forEach((s: any) => {
          routes.push(`/suppliers/${s.id}`);
        });
      }
    }
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      console.warn(
        "\n⚠️  [Sitemap Warning]: Could not connect to the API server at " +
          API_URL,
      );
      console.warn(
        "   To include dynamic routes (products/suppliers), ensure your backend is running",
      );
      console.warn(
        "   or provide a public API URL via VITE_API_URL environment variable.\n",
      );
    } else {
      console.error(
        "Error fetching dynamic routes for sitemap:",
        error.message,
      );
    }
  }

  return routes;
}

async function generate() {
  const dynamicRoutes = await getDynamicRoutes();
  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((route) => {
    return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>${route === "" ? "daily" : "weekly"}</changefreq>
    <priority>${route === "" ? "1.0" : route.split("/").length > 2 ? "0.6" : "0.8"}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  const publicPath = path.resolve(process.cwd(), "public");
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  fs.writeFileSync(path.join(publicPath, "sitemap.xml"), sitemap);
  console.log(`Sitemap generated with ${allRoutes.length} routes.`);
}

generate();
