import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { CommentDeleteForm } from "@/components/admin/comments/comment-delete-form";
import { db } from "@/lib/db";
import { comments } from "@/schema/comments";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const commentObj = await db.query.comments.findFirst({ where: eq(comments.id, id) });

  if (!commentObj) {
    notFound();
  }

  return (
    <div>
      <CommentDeleteForm comment={ commentObj } />
    </div>
  );
}
