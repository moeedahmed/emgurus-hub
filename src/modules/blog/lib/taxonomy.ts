export const CATEGORIES = [
  "General",
  "Exam Prep",
  "Exam Guidance",
  "Clinical Insights",
  "Clinical Compendium",
  "Research & Evidence",
  "Careers",
  "Announcements",
] as const;

export type Category = typeof CATEGORIES[number];

export function sanitizeCategory(input?: string | null): Category {
  const norm = (input || "").trim().toLowerCase();
  const found = CATEGORIES.find(c => c.toLowerCase() === norm);
  return (found || "General") as Category;
}

/** Tailwind-safe colour classes for category badges */
export const CATEGORY_COLORS: Record<string, string> = {
  "Exam Prep":            "text-orange-400",
  "Exam Guidance":        "text-orange-400",
  "Clinical Insights":    "text-emerald-400",
  "Clinical Compendium":  "text-emerald-400",
  "Research & Evidence":  "text-violet-400",
  "Careers":              "text-sky-400",
  "Announcements":        "text-amber-400",
  "General":              "text-muted-foreground",
};

export function getCategoryColor(category?: string | null): string {
  if (!category) return CATEGORY_COLORS["General"];
  return CATEGORY_COLORS[category] || CATEGORY_COLORS["General"];
}
