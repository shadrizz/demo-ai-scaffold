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

const deleteCommentSchema = createSelectSchema(comments, {
  id: z.coerce.string().cuid2(),
}).pick({ id: true });

export interface DeleteCommentState {
  errors?: {
    id?: string[];
  };
  message?: string;
}

export async function deleteComment(
  prevState: DeleteCommentState,
  formData: FormData
): Promise<DeleteCommentState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }

  const validatedFields = deleteCommentSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db.delete(comments).where(eq(comments.id, validatedFields.data.id));
  } catch (error) {
    console.log(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/comments");
  redirect("/admin/comments");
}
