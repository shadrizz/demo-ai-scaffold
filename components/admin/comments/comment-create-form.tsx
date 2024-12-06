"use client";

import { startTransition, useActionState } from "react";
import { createComment, CreateCommentState } from "@/actions/admin/comments/create-comment";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


export function CommentCreateForm() {
  const initialState: CreateCommentState = {};
  const [state, dispatch] = useActionState(createComment, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label>Bug Id</Label>
          <Input name="bugId" />
          {state.errors?.bugId?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>User Id</Label>
          <Input name="userId" />
          {state.errors?.userId?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Comment</Label>
          <Input name="comment" />
          {state.errors?.comment?.map((error) => (
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
