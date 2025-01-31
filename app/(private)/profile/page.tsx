import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  return <div>Email: {session?.user?.email}</div>;
}
