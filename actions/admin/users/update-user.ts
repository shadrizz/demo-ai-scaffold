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

const updateUserSchema = createSelectSchema(users, {
  id: z.coerce.string().cuid2(),
  name: z.coerce.string(),
  email: z.coerce.string(),
  emailVerified: z.coerce.date(),
  image: z.coerce.string(),
  role: z.coerce.string(),
  password: z.coerce.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
  .partial()
  .required({ id: true });

export interface UpdateUserState {
  errors?: {
    id?: string[];
    name?: string[];
    email?: string[];
    emailVerified?: string[];
    image?: string[];
    role?: string[];
    password?: string[];
    createdAt?: string[];
    updatedAt?: string[];
  };
  message?: string;
}

export async function updateUser(
  prevState: UpdateUserState,
  formData: FormData
): Promise<UpdateUserState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }


  const validatedFields = updateUserSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    emailVerified: formData.get("emailVerified"),
    image: formData.get("image"),
    role: formData.get("role"),
    password: formData.get("password"),
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
      .update(users)
      .set(validatedFields.data)
      .where(eq(users.id, validatedFields.data.id));
  } catch (error) {
    console.error(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/users/" + validatedFields.data.id);
  revalidatePath("/admin/users/" + validatedFields.data.id + "/edit");
  redirect("/admin/users/" + validatedFields.data.id);
}
