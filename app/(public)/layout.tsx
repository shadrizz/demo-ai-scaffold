import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="p-6">{children}</main >
      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";