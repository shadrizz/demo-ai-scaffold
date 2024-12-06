"use client";

import { deleteComment, DeleteCommentState } from "@/actions/admin/comments/delete-comment";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Comment } from "@/schema/comments";

export function CommentDeleteForm({ comment }: { comment: Comment }) {
  const initialState: DeleteCommentState = {};
  const [state, dispatch] = useActionState(deleteComment, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ comment.id} />
        <div>
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </div>
        {state.message && <p>{state.message}</p>}
      </form>
    </div>
  );
}
