"use server";

import { db } from "@/lib/db";
import { statuses } from "@/schema/statuses";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";


const insertStatusSchema = createInsertSchema(statuses, {
  statusName: z.coerce.string(),
});


export interface CreateStatusState {
  errors?: {
    id?: string[];
    statusName?: string[];
  };
  message?: string;
}

export async function createStatus(
  prevState: CreateStatusState,
  formData: FormData
): Promise<CreateStatusState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }


  const validatedFields = insertStatusSchema.safeParse({
    statusName: formData.get("statusName"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db.insert(statuses).values(validatedFields.data);
  } catch (error) {
    console.error(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/statuses");
  redirect("/admin/statuses");
}
