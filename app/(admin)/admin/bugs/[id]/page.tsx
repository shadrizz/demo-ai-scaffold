import { notFound } from "next/navigation";
import { getBugWithRelations } from "@/repositories/bug-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const bugObj = await getBugWithRelations(id);

  if (!bugObj) {
    notFound();
  }

  return (
    <div>
      <p><strong>Title:</strong> { bugObj.title }</p>
      <p><strong>Description:</strong> { bugObj.description }</p>
      <p><strong>Priority:</strong> { bugObj.priority }</p>
      <p><strong>Project Id:</strong> { bugObj.projectId }</p>
      <p><strong>Assigned To:</strong> { bugObj.assignedTo }</p>
      <p><strong>Status Id:</strong> { bugObj.statusId }</p>
      <p><strong>Created At:</strong> { bugObj.createdAt?.toLocaleString() }</p>
      <p><strong>Updated At:</strong> { bugObj.updatedAt?.toLocaleString() }</p>
    </div>
  );
}
