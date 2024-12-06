"use client";

import { startTransition, useActionState } from "react";
import { updateBug, UpdateBugState } from "@/actions/admin/bugs/update-bug";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Bug } from "@/schema/bugs";

export function BugUpdateForm({ 
  bug,
}: { 
  bug: Bug;
}) {
  const initialState: UpdateBugState = {};
  const [state, dispatch] = useActionState(updateBug, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ bug.id } />
        <div>
          <Label>Title</Label>
          <Input name="title" defaultValue={ bug.title ?? "" } />
          {state.errors?.title?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Description</Label>
          <Input name="description" defaultValue={ bug.description ?? "" } />
          {state.errors?.description?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Priority</Label>
          <Input name="priority" defaultValue={ bug.priority ?? "" } />
          {state.errors?.priority?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Project Id</Label>
          <Input name="projectId" defaultValue={ bug.projectId ?? "" } />
          {state.errors?.projectId?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Assigned To</Label>
          <Input name="assignedTo" defaultValue={ bug.assignedTo ?? "" } />
          {state.errors?.assignedTo?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Status Id</Label>
          <Input name="statusId" defaultValue={ bug.statusId ?? "" } />
          {state.errors?.statusId?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Created At</Label>
          <Input name="createdAt" defaultValue={ bug.createdAt?.toLocaleString() ?? "" } />
          {state.errors?.createdAt?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Updated At</Label>
          <Input name="updatedAt" defaultValue={ bug.updatedAt?.toLocaleString() ?? "" } />
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
