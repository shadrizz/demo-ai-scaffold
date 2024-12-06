import { sql, relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { bugs } from "./bugs";
import { users } from "./users";


export type Comment = typeof comments.$inferSelect;

export const comments = sqliteTable(
  "comments",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    bugId: text().references(() => bugs.id),
    userId: text().references(() => users.id),
    comment: text(),
    createdAt: integer({ mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer({ mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`).$onUpdate(() => new Date()),
  }
)

export const commentsRelations = relations(comments, ({ one, many }) => ({
  bug: one(bugs, {
    fields: [comments.bugId],
    references: [bugs.id]
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
}));
