"use server";

import { db } from "@/lib/db";
import { users } from "@/schema/users";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const deleteUserSchema = createSelectSchema(users, {
  id: z.coerce.string().cuid2(),
}).pick({ id: true });

export interface DeleteUserState {
  errors?: {
    id?: string[];
  };
  message?: string;
}

export async function deleteUser(
  prevState: DeleteUserState,
  formData: FormData
): Promise<DeleteUserState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }

  const validatedFields = deleteUserSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db.delete(users).where(eq(users.id, validatedFields.data.id));
  } catch (error) {
    console.log(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
