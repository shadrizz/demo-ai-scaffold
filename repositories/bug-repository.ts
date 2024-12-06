import { eq, like, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { Bug, bugs } from "@/schema/bugs";

export type BugsWithRelationsList = Awaited<
  ReturnType<typeof getBugsWithRelationsList>
>;

export async function getBugsWithRelationsList({
  limit,
  offset,
  search,
  sort,
  sortOrder,
}: {
  limit: number;
  offset: number;
  search?: string;
  sort?: string;
  sortOrder?: string;
}) {
  let orderBy = desc(bugs.createdAt);
  
  if (sort && sort in bugs) {
    switch (sortOrder) {
      case "asc":
        orderBy = sql`${ bugs[sort as keyof Bug] } asc`;
        break;
      case "desc":
        orderBy = sql`${ bugs[sort as keyof Bug] } desc`;
        break;
      default:
        break;
    }
  }

  return await db.query.bugs.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(bugs.id, `%${search}%`) : undefined,
    orderBy: orderBy,
    with: undefined
  });
}

export type BugWithRelations = Awaited<
  ReturnType<typeof getBugWithRelations>
>;

export async function getBugWithRelations(id: string) {
  return await db.query.bugs.findFirst({
    where: eq(bugs.id, id),
    with: undefined,
  });
}
