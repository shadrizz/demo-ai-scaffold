"use server";

import { db } from "@/lib/db";
import { comments } from "@/schema/comments";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const updateCommentSchema = createSelectSchema(comments, {
  id: z.coerce.string().cuid2(),
  bugId: z.coerce.string().cuid2(),
  userId: z.coerce.string().cuid2(),
  comment: z.coerce.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
  .partial()
  .required({ id: true });

export interface UpdateCommentState {
  errors?: {
    id?: string[];
    bugId?: string[];
    userId?: string[];
    comment?: string[];
    createdAt?: string[];
    updatedAt?: string[];
  };
  message?: string;
}

export async function updateComment(
  prevState: UpdateCommentState,
  formData: FormData
): Promise<UpdateCommentState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }


  const validatedFields = updateCommentSchema.safeParse({
    id: formData.get("id"),
    bugId: formData.get("bugId"),
    userId: formData.get("userId"),
    comment: formData.get("comment"),
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
      .update(comments)
      .set(validatedFields.data)
      .where(eq(comments.id, validatedFields.data.id));
  } catch (error) {
    console.error(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/comments");
  revalidatePath("/admin/comments/" + validatedFields.data.id);
  revalidatePath("/admin/comments/" + validatedFields.data.id + "/edit");
  redirect("/admin/comments/" + validatedFields.data.id);
}
