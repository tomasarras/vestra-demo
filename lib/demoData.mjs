export const CATEGORIES = [
  { name: "Remeras", slug: "remeras" },
  { name: "Pantalones", slug: "pantalones" },
  { name: "Camperas", slug: "camperas" },
  { name: "Accesorios", slug: "accesorios" },
];

export const SIZES_CLOTHING = ["S", "M", "L", "XL"];
export const SIZES_ACCESSORIES = ["Único"];

export const PRODUCTS = [
  { name: "Remera Básica Blanca", description: "Remera de algodón peinado, corte clásico.", price: 14000, categorySlug: "remeras", sizes: SIZES_CLOTHING },
  { name: "Remera Oversize Negra", description: "Remera oversize de algodón, cuello redondo.", price: 16500, categorySlug: "remeras", sizes: SIZES_CLOTHING },
  { name: "Remera Estampada Retro", description: "Remera con estampa retro serigrafiada.", price: 18000, categorySlug: "remeras", sizes: SIZES_CLOTHING },
  { name: "Remera Rayada Marina", description: "Remera a rayas, estilo marinero.", price: 15500, categorySlug: "remeras", sizes: SIZES_CLOTHING },
  { name: "Jean Recto Azul", description: "Jean de corte recto, tiro medio.", price: 32000, categorySlug: "pantalones", sizes: SIZES_CLOTHING },
  { name: "Jogger Gris Melange", description: "Pantalón jogger de algodón con puño.", price: 27000, categorySlug: "pantalones", sizes: SIZES_CLOTHING },
  { name: "Pantalón Cargo Verde", description: "Pantalón cargo con bolsillos laterales.", price: 34500, categorySlug: "pantalones", sizes: SIZES_CLOTHING },
  { name: "Campera de Jean", description: "Campera de jean clásica, forro interno.", price: 45000, categorySlug: "camperas", sizes: SIZES_CLOTHING },
  { name: "Campera Rompeviento", description: "Campera liviana, ideal para entretiempo.", price: 38000, categorySlug: "camperas", sizes: SIZES_CLOTHING },
  { name: "Campera Puffer Negra", description: "Campera acolchada para el frío.", price: 52000, categorySlug: "camperas", sizes: SIZES_CLOTHING },
  { name: "Gorra Bordada", description: "Gorra de 6 paneles con logo bordado.", price: 9500, categorySlug: "accesorios", sizes: SIZES_ACCESSORIES },
  { name: "Cinturón de Cuero", description: "Cinturón de cuero genuino, hebilla metálica.", price: 12500, categorySlug: "accesorios", sizes: SIZES_ACCESSORIES },
];

export const COUPONS = [
  {
    code: "BIENVENIDO10",
    discountPercent: 10,
    appliesToAll: true,
    quantity: null,
    expiresInDays: null,
  },
  {
    code: "REMERAS5",
    discountPercent: 20,
    appliesToAll: false,
    categorySlugs: ["remeras"],
    quantity: 5,
    expiresInDays: 7,
  },
];
