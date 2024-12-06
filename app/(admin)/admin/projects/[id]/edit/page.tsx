import { notFound } from "next/navigation";
import { ProjectUpdateForm } from "@/components/admin/projects/project-update-form";
import { getProjectWithRelations } from "@/repositories/project-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const projectObj = await getProjectWithRelations(id);

  if (!projectObj) {
    notFound();
  }


  return (
    <div>
      <ProjectUpdateForm 
        project={ projectObj }
      />
    </div>
  );
}
