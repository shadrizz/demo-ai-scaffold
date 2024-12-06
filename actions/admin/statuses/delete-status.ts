"use server";

import { db } from "@/lib/db";
import { statuses } from "@/schema/statuses";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const deleteStatusSchema = createSelectSchema(statuses, {
  id: z.coerce.string().cuid2(),
}).pick({ id: true });

export interface DeleteStatusState {
  errors?: {
    id?: string[];
  };
  message?: string;
}

export async function deleteStatus(
  prevState: DeleteStatusState,
  formData: FormData
): Promise<DeleteStatusState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }

  const validatedFields = deleteStatusSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db.delete(statuses).where(eq(statuses.id, validatedFields.data.id));
  } catch (error) {
    console.log(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/statuses");
  redirect("/admin/statuses");
}
