import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { StatusDeleteForm } from "@/components/admin/statuses/status-delete-form";
import { db } from "@/lib/db";
import { statuses } from "@/schema/statuses";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const statusObj = await db.query.statuses.findFirst({ where: eq(statuses.id, id) });

  if (!statusObj) {
    notFound();
  }

  return (
    <div>
      <StatusDeleteForm status={ statusObj } />
    </div>
  );
}
