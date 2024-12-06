import { notFound } from "next/navigation";
import { getCommentWithRelations } from "@/repositories/comment-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const commentObj = await getCommentWithRelations(id);

  if (!commentObj) {
    notFound();
  }

  return (
    <div>
      <p><strong>Bug Id:</strong> { commentObj.bugId }</p>
      <p><strong>User Id:</strong> { commentObj.userId }</p>
      <p><strong>Comment:</strong> { commentObj.comment }</p>
      <p><strong>Created At:</strong> { commentObj.createdAt?.toLocaleString() }</p>
      <p><strong>Updated At:</strong> { commentObj.updatedAt?.toLocaleString() }</p>
    </div>
  );
}
