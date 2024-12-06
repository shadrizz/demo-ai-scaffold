import { ModeToggle } from "@/components/mode-toggle"; import Link from
"next/link"; export function Header() { return (
<header>
  <div
    className="container mx-auto px-6 py-4 flex justify-between items-center"
  >
    <div className="flex items-center">
      <Link href="/" className="font-bold">
        shadrizz
      </Link>
    </div>
    <div>
      <Link href="https://www.shadrizz.com/docs" className="mr-4">
        Docs
      </Link>
        <Link href="/dashboard" className="mr-4">
          Dashboard
        </Link>
        <Link href="/admin" className="mr-4">
          Admin
        </Link>
        <Link href="/signin">
          Sign In
        </Link>
      <div className="ml-5 inline-block">
        <ModeToggle />
      </div>
    </div>
  </div>
</header>
); }