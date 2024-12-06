import { sql, relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";


export type Status = typeof statuses.$inferSelect;

export const statuses = sqliteTable(
  "statuses",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    statusName: text(),
    createdAt: integer({ mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer({ mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`).$onUpdate(() => new Date()),
  }
)

export const statusesRelations = relations(statuses, ({ one, many }) => ({
}));
