import { notFound } from "next/navigation";
import { getStatusWithRelations } from "@/repositories/status-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const statusObj = await getStatusWithRelations(id);

  if (!statusObj) {
    notFound();
  }

  return (
    <div>
      <p><strong>Status Name:</strong> { statusObj.statusName }</p>
      <p><strong>Created At:</strong> { statusObj.createdAt?.toLocaleString() }</p>
      <p><strong>Updated At:</strong> { statusObj.updatedAt?.toLocaleString() }</p>
    </div>
  );
}
