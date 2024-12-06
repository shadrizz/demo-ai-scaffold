"use client";

import { startTransition, useActionState } from "react";
import { createStatus, CreateStatusState } from "@/actions/admin/statuses/create-status";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


export function StatusCreateForm() {
  const initialState: CreateStatusState = {};
  const [state, dispatch] = useActionState(createStatus, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label>Status Name</Label>
          <Input name="statusName" />
          {state.errors?.statusName?.map((error) => (
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
