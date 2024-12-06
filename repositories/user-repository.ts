import { eq, like, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { User, users } from "@/schema/users";

export type UsersWithRelationsList = Awaited<
  ReturnType<typeof getUsersWithRelationsList>
>;

export async function getUsersWithRelationsList({
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
  let orderBy = desc(users.createdAt);
  
  if (sort && sort in users) {
    switch (sortOrder) {
      case "asc":
        orderBy = sql`${ users[sort as keyof User] } asc`;
        break;
      case "desc":
        orderBy = sql`${ users[sort as keyof User] } desc`;
        break;
      default:
        break;
    }
  }

  return await db.query.users.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(users.id, `%${search}%`) : undefined,
    orderBy: orderBy,
    with: undefined
  });
}

export type UserWithRelations = Awaited<
  ReturnType<typeof getUserWithRelations>
>;

export async function getUserWithRelations(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    with: undefined,
  });
}
