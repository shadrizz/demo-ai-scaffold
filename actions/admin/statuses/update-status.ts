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

const updateStatusSchema = createSelectSchema(statuses, {
  id: z.coerce.string().cuid2(),
  statusName: z.coerce.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
  .partial()
  .required({ id: true });

export interface UpdateStatusState {
  errors?: {
    id?: string[];
    statusName?: string[];
    createdAt?: string[];
    updatedAt?: string[];
  };
  message?: string;
}

export async function updateStatus(
  prevState: UpdateStatusState,
  formData: FormData
): Promise<UpdateStatusState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }


  const validatedFields = updateStatusSchema.safeParse({
    id: formData.get("id"),
    statusName: formData.get("statusName"),
    createdAt: formData.get("createdAt"),
    updatedAt: formData.get("updatedAt"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db
      .update(statuses)
      .set(validatedFields.data)
      .where(eq(statuses.id, validatedFields.data.id));
  } catch (error) {
    console.error(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/statuses");
  revalidatePath("/admin/statuses/" + validatedFields.data.id);
  revalidatePath("/admin/statuses/" + validatedFields.data.id + "/edit");
  redirect("/admin/statuses/" + validatedFields.data.id);
}
