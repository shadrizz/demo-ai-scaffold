"use client";

import { startTransition, useActionState } from "react";
import { updateComment, UpdateCommentState } from "@/actions/admin/comments/update-comment";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Comment } from "@/schema/comments";

export function CommentUpdateForm({ 
  comment,
}: { 
  comment: Comment;
}) {
  const initialState: UpdateCommentState = {};
  const [state, dispatch] = useActionState(updateComment, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ comment.id } />
        <div>
          <Label>Bug Id</Label>
          <Input name="bugId" defaultValue={ comment.bugId ?? "" } />
          {state.errors?.bugId?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>User Id</Label>
          <Input name="userId" defaultValue={ comment.userId ?? "" } />
          {state.errors?.userId?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Comment</Label>
          <Input name="comment" defaultValue={ comment.comment ?? "" } />
          {state.errors?.comment?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Created At</Label>
          <Input name="createdAt" defaultValue={ comment.createdAt?.toLocaleString() ?? "" } />
          {state.errors?.createdAt?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Updated At</Label>
          <Input name="updatedAt" defaultValue={ comment.updatedAt?.toLocaleString() ?? "" } />
          {state.errors?.updatedAt?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
        {state.message && <p>{state.message}</p>}
      </form>
    </div>
  );
}
