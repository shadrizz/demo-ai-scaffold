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

const deleteBugSchema = createSelectSchema(bugs, {
  id: z.coerce.string().cuid2(),
}).pick({ id: true });

export interface DeleteBugState {
  errors?: {
    id?: string[];
  };
  message?: string;
}

export async function deleteBug(
  prevState: DeleteBugState,
  formData: FormData
): Promise<DeleteBugState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }

  const validatedFields = deleteBugSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db.delete(bugs).where(eq(bugs.id, validatedFields.data.id));
  } catch (error) {
    console.log(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/bugs");
  redirect("/admin/bugs");
}
