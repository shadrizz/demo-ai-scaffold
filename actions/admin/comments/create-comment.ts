"use server";

import { db } from "@/lib/db";
import { comments } from "@/schema/comments";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";


const insertCommentSchema = createInsertSchema(comments, {
  bugId: z.coerce.string().cuid2(),
  userId: z.coerce.string().cuid2(),
  comment: z.coerce.string(),
});


export interface CreateCommentState {
  errors?: {
    id?: string[];
    bugId?: string[];
    userId?: string[];
    comment?: string[];
  };
  message?: string;
}

export async function createComment(
  prevState: CreateCommentState,
  formData: FormData
): Promise<CreateCommentState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdmin(session)) {
    throw new Error("unauthorized");
  }


  const validatedFields = insertCommentSchema.safeParse({
    bugId: formData.get("bugId"),
    userId: formData.get("userId"),
    comment: formData.get("comment"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "invalid data",
    };
  }

  try {
    await db.insert(comments).values(validatedFields.data);
  } catch (error) {
    console.error(error);
    return {
      message: "database error",
    }
  }

  revalidatePath("/admin/comments");
  redirect("/admin/comments");
}
