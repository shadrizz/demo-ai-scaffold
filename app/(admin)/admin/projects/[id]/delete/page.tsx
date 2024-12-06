import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ProjectDeleteForm } from "@/components/admin/projects/project-delete-form";
import { db } from "@/lib/db";
import { projects } from "@/schema/projects";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const projectObj = await db.query.projects.findFirst({ where: eq(projects.id, id) });

  if (!projectObj) {
    notFound();
  }

  return (
    <div>
      <ProjectDeleteForm project={ projectObj } />
    </div>
  );
}
