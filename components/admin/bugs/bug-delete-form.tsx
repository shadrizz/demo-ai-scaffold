"use client";

import { deleteBug, DeleteBugState } from "@/actions/admin/bugs/delete-bug";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Bug } from "@/schema/bugs";

export function BugDeleteForm({ bug }: { bug: Bug }) {
  const initialState: DeleteBugState = {};
  const [state, dispatch] = useActionState(deleteBug, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ bug.id} />
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
