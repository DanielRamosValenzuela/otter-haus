import { CONTACT } from "@/lib/content/site";
import { whatsappUrl } from "@/lib/utils/whatsapp";
import { WhatsAppIcon } from "@/components/icons/social-icons";

export function WhatsAppFab() {
  const href = whatsappUrl({
    phone: CONTACT.whatsapp,
    message: "Hola, me gustaría más información sobre las propiedades de TranHaus.",
  });

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
