import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { BugDeleteForm } from "@/components/admin/bugs/bug-delete-form";
import { db } from "@/lib/db";
import { bugs } from "@/schema/bugs";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const bugObj = await db.query.bugs.findFirst({ where: eq(bugs.id, id) });

  if (!bugObj) {
    notFound();
  }

  return (
    <div>
      <BugDeleteForm bug={ bugObj } />
    </div>
  );
}
