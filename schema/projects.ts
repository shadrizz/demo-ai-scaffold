import { sql, relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { users } from "./users";


export type Project = typeof projects.$inferSelect;

export const projects = sqliteTable(
  "projects",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    name: text(),
    description: text(),
    userId: text().references(() => users.id),
    createdAt: integer({ mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer({ mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`).$onUpdate(() => new Date()),
  }
)

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id]
  }),
}));
