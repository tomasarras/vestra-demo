export const CATEGORIES = [
  { name: "Remeras", slug: "remeras" },
  { name: "Pantalones", slug: "pantalones" },
  { name: "Camperas", slug: "camperas" },
  { name: "Accesorios", slug: "accesorios" },
];

export const SIZES_CLOTHING = ["S", "M", "L", "XL"];
export const SIZES_ACCESSORIES = ["Único"];

// Fotos subidas a mano desde /admin a Vercel Blob (store vestra-demo-blob). El
// reset diario borra la fila de ProductImage pero nunca el blob en sí, así que
// hardcodear estas URLs acá es lo que permite que el reset las vuelva a sembrar
// en vez de dejar los productos sin imagen.
const BLOB_BASE = "https://lgi1r3maboct1i3z.public.blob.vercel-storage.com";

export const PRODUCTS = [
  { name: "Remera Básica Blanca", description: "Remera de algodón peinado, corte clásico.", price: 14000, categorySlug: "remeras", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/remera-basica-blanca-ynPIuuyHvrWkEOIltFTFotmKCkBTb8.png`] },
  { name: "Remera Oversize Negra", description: "Remera oversize de algodón, cuello redondo.", price: 16500, categorySlug: "remeras", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/remera-oversize-negra-3G7Pfa8ByphXLMjqi45Cj6rTgF3QKF.png`, `${BLOB_BASE}/remera-oversize-negra-5GJA6UDXuRNByvIdR5gyYf1IKeH0oP.png`] },
  { name: "Remera Estampada Retro", description: "Remera con estampa retro serigrafiada.", price: 18000, categorySlug: "remeras", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/remera-estampada-retro-85iVKYU14o3jPcMjPayM8r3HMNB1j5.png`, `${BLOB_BASE}/remera-estampada-retro-OMlnWAHhDntNF3LYxHjVyUQBZUHSrx.png`] },
  { name: "Remera Rayada Marina", description: "Remera a rayas, estilo marinero.", price: 15500, categorySlug: "remeras", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/remera-rayada-marina-2KrTtEnucyLeSg8NlDUIHh9TdCoh1J.png`, `${BLOB_BASE}/remera-rayada-marina-BJQj2oriHwQZcaMmlcnacyPAmVWtfN.png`] },
  { name: "Jean Recto Azul", description: "Jean de corte recto, tiro medio.", price: 32000, categorySlug: "pantalones", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/jean-recto-azul-Mvoyn0ekCHuJ6jAd0qWI9nd7YamerF.png`, `${BLOB_BASE}/jean-recto-azul-kuexhcrxOnG9FpqgPiTR9siE9sH8F8.png`] },
  { name: "Jogger Gris Melange", description: "Pantalón jogger de algodón con puño.", price: 27000, categorySlug: "pantalones", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/jogger-gris-melange-C3aUzmlRL3A2VL9XHGmuNwcC7ZK7lN.png`, `${BLOB_BASE}/jogger-gris-melange-lRZQtcRckhqJ20PmiQlIPmnvzNkKpu.png`] },
  { name: "Pantalón Cargo Verde", description: "Pantalón cargo con bolsillos laterales.", price: 34500, categorySlug: "pantalones", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/pantalon-cargo-verde-2M2ryIFpSU7iMeSQISUU0RxkxcqPVp.png`, `${BLOB_BASE}/pantalon-cargo-verde-MbVPBtwjCBeNSurJ8Cf48XjLHIKRsN.png`] },
  { name: "Campera de Jean", description: "Campera de jean clásica, forro interno.", price: 45000, categorySlug: "camperas", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/campera-de-jean-2s1JxmAy6Z0caocWvq5uhypTLA4non.png`, `${BLOB_BASE}/campera-de-jean-GB7a5qbK1Yqp0oeiWmN0OkxUygpZwv.png`] },
  { name: "Campera Rompeviento", description: "Campera liviana, ideal para entretiempo.", price: 38000, categorySlug: "camperas", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/campera-rompeviento-IjSfcWO1Vf1lzDwohjazKrz4yZhimr.png`, `${BLOB_BASE}/campera-rompeviento-apS3sAI7pENLq6AqYi5gmPVh2pqwmV.png`] },
  { name: "Campera Puffer Negra", description: "Campera acolchada para el frío.", price: 52000, categorySlug: "camperas", sizes: SIZES_CLOTHING, images: [`${BLOB_BASE}/campera-puffer-negra-ZCB7WSR7qAHjyumUgf1Oddn0i3vps4.png`, `${BLOB_BASE}/campera-puffer-negra-dRA3PfNukr83MoNC7gSoKPJhWTwNRa.png`] },
  { name: "Gorra Bordada", description: "Gorra de 6 paneles con logo bordado.", price: 9500, categorySlug: "accesorios", sizes: SIZES_ACCESSORIES, images: [`${BLOB_BASE}/gorra-bordada-X7SktCaHfQe8ZXYGm73aE4E07N6ulG.png`, `${BLOB_BASE}/gorra-bordada-wJq2xi264FfNv5XVWOQJYowMgwKqmK.png`] },
  { name: "Cinturón de Cuero", description: "Cinturón de cuero genuino, hebilla metálica.", price: 12500, categorySlug: "accesorios", sizes: SIZES_ACCESSORIES, images: [`${BLOB_BASE}/cinturon-de-cuero-nJff26l1R4Sl4OvVrj4ZgVkOQBVjAq.png`] },
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
