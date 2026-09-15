import { getAgent } from "@/lib/data/agent";
import { whatsappUrl } from "@/lib/utils/whatsapp";
import { WhatsAppIcon } from "@/components/icons/social-icons";

export async function WhatsAppFab() {
  const agent = await getAgent();
  const href = whatsappUrl({ phone: agent.whatsapp, message: agent.whatsappMessage });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={[
        "fixed bottom-6 right-6 z-30 flex size-14 items-center justify-center rounded-full",
        "bg-[#25D366] text-white shadow-lift transition-transform duration-200 ease-lux",
        "hover:scale-110 active:scale-95",
      ].join(" ")}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
