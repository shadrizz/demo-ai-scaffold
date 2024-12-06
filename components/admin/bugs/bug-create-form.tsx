"use client";

import { startTransition, useActionState } from "react";
import { createBug, CreateBugState } from "@/actions/admin/bugs/create-bug";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


export function BugCreateForm() {
  const initialState: CreateBugState = {};
  const [state, dispatch] = useActionState(createBug, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label>Title</Label>
          <Input name="title" />
          {state.errors?.title?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Description</Label>
          <Input name="description" />
          {state.errors?.description?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Priority</Label>
          <Input name="priority" />
          {state.errors?.priority?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Project Id</Label>
          <Input name="projectId" />
          {state.errors?.projectId?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Assigned To</Label>
          <Input name="assignedTo" />
          {state.errors?.assignedTo?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Status Id</Label>
          <Input name="statusId" />
          {state.errors?.statusId?.map((error) => (
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
