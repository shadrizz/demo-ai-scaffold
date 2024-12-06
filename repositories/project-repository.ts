import { eq, like, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { Project, projects } from "@/schema/projects";

export type ProjectsWithRelationsList = Awaited<
  ReturnType<typeof getProjectsWithRelationsList>
>;

export async function getProjectsWithRelationsList({
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
  let orderBy = desc(projects.createdAt);
  
  if (sort && sort in projects) {
    switch (sortOrder) {
      case "asc":
        orderBy = sql`${ projects[sort as keyof Project] } asc`;
        break;
      case "desc":
        orderBy = sql`${ projects[sort as keyof Project] } desc`;
        break;
      default:
        break;
    }
  }

  return await db.query.projects.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(projects.id, `%${search}%`) : undefined,
    orderBy: orderBy,
    with: undefined
  });
}

export type ProjectWithRelations = Awaited<
  ReturnType<typeof getProjectWithRelations>
>;

export async function getProjectWithRelations(id: string) {
  return await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: undefined,
  });
}
