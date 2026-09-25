import { Shirt } from "lucide-react";

const CATEGORY_COLORS = {
  remeras: "#C97B4A",
  pantalones: "#3B5BA5",
  camperas: "#6B7A4A",
  accesorios: "#C9A227",
};

export default function ProductImagePlaceholder({ categorySlug, className }) {
  const color = CATEGORY_COLORS[categorySlug] || "#8a8a8a";

  return (
    <div
      className={`flex items-center justify-center ${className || ""}`}
      style={{ backgroundColor: `${color}22` }}
    >
      <Shirt size={48} color={color} strokeWidth={1.5} />
    </div>
  );
}
