import { notFound } from "next/navigation";
import { UserUpdateForm } from "@/components/admin/users/user-update-form";
import { getUserWithRelations } from "@/repositories/user-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const userObj = await getUserWithRelations(id);

  if (!userObj) {
    notFound();
  }


  return (
    <div>
      <UserUpdateForm 
        user={ userObj }
      />
    </div>
  );
}
