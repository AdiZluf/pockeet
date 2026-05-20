import { db } from "../client";

export async function listCategories() {
  return db.query.categories.findMany({
    orderBy: (category, { asc }) => [asc(category.sortOrder)],
  });
}
