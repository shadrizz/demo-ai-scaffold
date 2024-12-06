"use client";

import { deleteProject, DeleteProjectState } from "@/actions/admin/projects/delete-project";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Project } from "@/schema/projects";

export function ProjectDeleteForm({ project }: { project: Project }) {
  const initialState: DeleteProjectState = {};
  const [state, dispatch] = useActionState(deleteProject, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ project.id} />
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
