import { eq, like, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { Status, statuses } from "@/schema/statuses";

export type StatusesWithRelationsList = Awaited<
  ReturnType<typeof getStatusesWithRelationsList>
>;

export async function getStatusesWithRelationsList({
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
  let orderBy = desc(statuses.createdAt);
  
  if (sort && sort in statuses) {
    switch (sortOrder) {
      case "asc":
        orderBy = sql`${ statuses[sort as keyof Status] } asc`;
        break;
      case "desc":
        orderBy = sql`${ statuses[sort as keyof Status] } desc`;
        break;
      default:
        break;
    }
  }

  return await db.query.statuses.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(statuses.id, `%${search}%`) : undefined,
    orderBy: orderBy,
    with: undefined
  });
}

export type StatusWithRelations = Awaited<
  ReturnType<typeof getStatusWithRelations>
>;

export async function getStatusWithRelations(id: string) {
  return await db.query.statuses.findFirst({
    where: eq(statuses.id, id),
    with: undefined,
  });
}
