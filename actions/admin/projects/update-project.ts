"use server";

import { db } from "@/lib/db";
import { projects } from "@/schema/projects";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const updateProjectSchema = createSelectSchema(projects, {
  id: z.coerce.string().cuid2(),
  name: z.coerce.string(),
  description: z.coerce.string(),
  userId: z.coerce.string().cuid2(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
  .partial()
  .required({ id: true });

export interface UpdateProjectState {
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    userId?: string[];
    createdAt?: string[];
    updatedAt?: string[];
  };
  message?: string;
}

export async function updateProject(
  prevState: UpdateProjectState,
  formData: FormData
): Promise<UpdateProjectState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }


  const validatedFields = updateProjectSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    userId: formData.get("userId"),
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
      .update(projects)
      .set(validatedFields.data)
      .where(eq(projects.id, validatedFields.data.id));
  } catch (error) {
    console.error(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin/projects/" + validatedFields.data.id);
  revalidatePath("/admin/projects/" + validatedFields.data.id + "/edit");
  redirect("/admin/projects/" + validatedFields.data.id);
}
