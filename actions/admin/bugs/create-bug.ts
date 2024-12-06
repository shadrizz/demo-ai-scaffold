"use server";

import { db } from "@/lib/db";
import { bugs } from "@/schema/bugs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";


const insertBugSchema = createInsertSchema(bugs, {
  title: z.coerce.string(),
  description: z.coerce.string(),
  priority: z.coerce.string(),
  projectId: z.coerce.string().cuid2(),
  assignedTo: z.coerce.number(),
  statusId: z.coerce.string().cuid2(),
});


export interface CreateBugState {
  errors?: {
    id?: string[];
    title?: string[];
    description?: string[];
    priority?: string[];
    projectId?: string[];
    assignedTo?: string[];
    statusId?: string[];
  };
  message?: string;
}

export async function createBug(
  prevState: CreateBugState,
  formData: FormData
): Promise<CreateBugState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }


  const validatedFields = insertBugSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    projectId: formData.get("projectId"),
    assignedTo: formData.get("assignedTo"),
    statusId: formData.get("statusId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db.insert(bugs).values(validatedFields.data);
  } catch (error) {
    console.error(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/bugs");
  redirect("/admin/bugs");
}
