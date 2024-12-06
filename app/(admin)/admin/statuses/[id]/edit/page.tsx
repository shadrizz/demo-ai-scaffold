import { notFound } from "next/navigation";
import { StatusUpdateForm } from "@/components/admin/statuses/status-update-form";
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
      <StatusUpdateForm 
        status={ statusObj }
      />
    </div>
  );
}
