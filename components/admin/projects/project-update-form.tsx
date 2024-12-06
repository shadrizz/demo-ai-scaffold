"use client";

import { startTransition, useActionState } from "react";
import { updateProject, UpdateProjectState } from "@/actions/admin/projects/update-project";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Project } from "@/schema/projects";

export function ProjectUpdateForm({ 
  project,
}: { 
  project: Project;
}) {
  const initialState: UpdateProjectState = {};
  const [state, dispatch] = useActionState(updateProject, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ project.id } />
        <div>
          <Label>Name</Label>
          <Input name="name" defaultValue={ project.name ?? "" } />
          {state.errors?.name?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Description</Label>
          <Input name="description" defaultValue={ project.description ?? "" } />
          {state.errors?.description?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>User Id</Label>
          <Input name="userId" defaultValue={ project.userId ?? "" } />
          {state.errors?.userId?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Created At</Label>
          <Input name="createdAt" defaultValue={ project.createdAt?.toLocaleString() ?? "" } />
          {state.errors?.createdAt?.map((error) => (
            <p className="text-destructive" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Updated At</Label>
          <Input name="updatedAt" defaultValue={ project.updatedAt?.toLocaleString() ?? "" } />
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
