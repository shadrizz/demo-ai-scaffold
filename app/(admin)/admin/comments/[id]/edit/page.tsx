import { notFound } from "next/navigation";
import { CommentUpdateForm } from "@/components/admin/comments/comment-update-form";
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
      <CommentUpdateForm 
        comment={ commentObj }
      />
    </div>
  );
}
