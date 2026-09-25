export function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatDate(dateLike) {
  const d = new Date(dateLike);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const ACCENTS = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ñ: "n", ü: "u" };

export function slugify(name) {
  return name
    .toLowerCase()
    .split("")
    .map((c) => ACCENTS[c] || c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
