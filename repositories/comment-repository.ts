import { eq, like, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { Comment, comments } from "@/schema/comments";

export type CommentsWithRelationsList = Awaited<
  ReturnType<typeof getCommentsWithRelationsList>
>;

export async function getCommentsWithRelationsList({
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
  let orderBy = desc(comments.createdAt);
  
  if (sort && sort in comments) {
    switch (sortOrder) {
      case "asc":
        orderBy = sql`${ comments[sort as keyof Comment] } asc`;
        break;
      case "desc":
        orderBy = sql`${ comments[sort as keyof Comment] } desc`;
        break;
      default:
        break;
    }
  }

  return await db.query.comments.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(comments.id, `%${search}%`) : undefined,
    orderBy: orderBy,
    with: undefined
  });
}

export type CommentWithRelations = Awaited<
  ReturnType<typeof getCommentWithRelations>
>;

export async function getCommentWithRelations(id: string) {
  return await db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: undefined,
  });
}
