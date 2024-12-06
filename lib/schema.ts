import * as users from "@/schema/users";
import * as authTables from "@/schema/auth-tables";

export const schema = {
  ...users,
  ...authTables,
}