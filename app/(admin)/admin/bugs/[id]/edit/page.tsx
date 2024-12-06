import { notFound } from "next/navigation";
import { BugUpdateForm } from "@/components/admin/bugs/bug-update-form";
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
      <BugUpdateForm 
        bug={ bugObj }
      />
    </div>
  );
}
