import { notFound } from "next/navigation";
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
      <p><strong>Name:</strong> { projectObj.name }</p>
      <p><strong>Description:</strong> { projectObj.description }</p>
      <p><strong>User Id:</strong> { projectObj.userId }</p>
      <p><strong>Created At:</strong> { projectObj.createdAt?.toLocaleString() }</p>
      <p><strong>Updated At:</strong> { projectObj.updatedAt?.toLocaleString() }</p>
    </div>
  );
}
