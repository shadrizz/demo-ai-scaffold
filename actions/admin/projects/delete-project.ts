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

const deleteProjectSchema = createSelectSchema(projects, {
  id: z.coerce.string().cuid2(),
}).pick({ id: true });

export interface DeleteProjectState {
  errors?: {
    id?: string[];
  };
  message?: string;
}

export async function deleteProject(
  prevState: DeleteProjectState,
  formData: FormData
): Promise<DeleteProjectState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }

  const validatedFields = deleteProjectSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db.delete(projects).where(eq(projects.id, validatedFields.data.id));
  } catch (error) {
    console.log(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
