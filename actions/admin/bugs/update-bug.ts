"use server";

import { db } from "@/lib/db";
import { bugs } from "@/schema/bugs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const updateBugSchema = createSelectSchema(bugs, {
  id: z.coerce.string().cuid2(),
  title: z.coerce.string(),
  description: z.coerce.string(),
  priority: z.coerce.string(),
  projectId: z.coerce.string().cuid2(),
  assignedTo: z.coerce.number(),
  statusId: z.coerce.string().cuid2(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
  .partial()
  .required({ id: true });

export interface UpdateBugState {
  errors?: {
    id?: string[];
    title?: string[];
    description?: string[];
    priority?: string[];
    projectId?: string[];
    assignedTo?: string[];
    statusId?: string[];
    createdAt?: string[];
    updatedAt?: string[];
  };
  message?: string;
}

export async function updateBug(
  prevState: UpdateBugState,
  formData: FormData
): Promise<UpdateBugState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }


  const validatedFields = updateBugSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    projectId: formData.get("projectId"),
    assignedTo: formData.get("assignedTo"),
    statusId: formData.get("statusId"),
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
      .update(bugs)
      .set(validatedFields.data)
      .where(eq(bugs.id, validatedFields.data.id));
  } catch (error) {
    console.error(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/bugs");
  revalidatePath("/admin/bugs/" + validatedFields.data.id);
  revalidatePath("/admin/bugs/" + validatedFields.data.id + "/edit");
  redirect("/admin/bugs/" + validatedFields.data.id);
}
