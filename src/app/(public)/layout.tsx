import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <LocalBusinessJsonLd />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </SmoothScroll>
  );
}
