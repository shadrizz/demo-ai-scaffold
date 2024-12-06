"use client";

import { deleteStatus, DeleteStatusState } from "@/actions/admin/statuses/delete-status";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { Status } from "@/schema/statuses";

export function StatusDeleteForm({ status }: { status: Status }) {
  const initialState: DeleteStatusState = {};
  const [state, dispatch] = useActionState(deleteStatus, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ status.id} />
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
