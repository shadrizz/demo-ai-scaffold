import { sql, relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { projects } from "./projects";
import { statuses } from "./statuses";


export type Bug = typeof bugs.$inferSelect;

export const bugs = sqliteTable(
  "bugs",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    title: text(),
    description: text(),
    priority: text(),
    projectId: text().references(() => projects.id),
    assignedTo: integer(),
    statusId: text().references(() => statuses.id),
    createdAt: integer({ mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer({ mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`).$onUpdate(() => new Date()),
  }
)

export const bugsRelations = relations(bugs, ({ one, many }) => ({
  project: one(projects, {
    fields: [bugs.projectId],
    references: [projects.id]
  }),
  status: one(statuses, {
    fields: [bugs.statusId],
    references: [statuses.id]
  }),
}));
