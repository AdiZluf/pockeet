import type { InferInsertModel } from "drizzle-orm";

import { categories } from "../schema";

export type CategorySeed = InferInsertModel<typeof categories>;

export const categorySeeds: CategorySeed[] = [
  {
    id: "cat_groceries",
    slug: "groceries",
    nameEn: "Groceries",
    nameHe: "מכולת",
    icon: "cart",
    color: "chart-1",
    sortOrder: 1,
  },
  {
    id: "cat_dining",
    slug: "dining",
    nameEn: "Dining",
    nameHe: "אוכל בחוץ",
    icon: "utensils",
    color: "chart-2",
    sortOrder: 2,
  },
  {
    id: "cat_transport",
    slug: "transport",
    nameEn: "Transport",
    nameHe: "תחבורה",
    icon: "car",
    color: "chart-3",
    sortOrder: 3,
  },
  {
    id: "cat_household",
    slug: "household",
    nameEn: "Household",
    nameHe: "בית",
    icon: "home",
    color: "chart-4",
    sortOrder: 4,
  },
  {
    id: "cat_health",
    slug: "health",
    nameEn: "Health",
    nameHe: "בריאות",
    icon: "heart",
    color: "chart-5",
    sortOrder: 5,
  },
  {
    id: "cat_shopping",
    slug: "shopping",
    nameEn: "Shopping",
    nameHe: "קניות",
    icon: "bag",
    color: "chart-6",
    sortOrder: 6,
  },
  {
    id: "cat_entertainment",
    slug: "entertainment",
    nameEn: "Entertainment",
    nameHe: "בילוי",
    icon: "ticket",
    color: "chart-7",
    sortOrder: 7,
  },
  {
    id: "cat_other",
    slug: "other",
    nameEn: "Other",
    nameHe: "אחר",
    icon: "circle",
    color: "chart-8",
    sortOrder: 8,
  },
];
