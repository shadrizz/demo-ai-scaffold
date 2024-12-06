"use server";

import { db } from "@/lib/db";
import { projects } from "@/schema/projects";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";


const insertProjectSchema = createInsertSchema(projects, {
  name: z.coerce.string(),
  description: z.coerce.string(),
  userId: z.coerce.string().cuid2(),
});


export interface CreateProjectState {
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    userId?: string[];
  };
  message?: string;
}

export async function createProject(
  prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }


  const validatedFields = insertProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    userId: formData.get("userId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db.insert(projects).values(validatedFields.data);
  } catch (error) {
    console.error(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
