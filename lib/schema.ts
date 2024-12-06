import * as statuses from "@/schema/statuses";
import * as comments from "@/schema/comments";
import * as bugs from "@/schema/bugs";
import * as projects from "@/schema/projects";
import * as users from "@/schema/users";
import * as authTables from "@/schema/auth-tables";

export const schema = {
  ...statuses,
  ...comments,
  ...bugs,
  ...projects,
  ...users,
  ...authTables,
}