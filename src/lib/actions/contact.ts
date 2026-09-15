"use server";

import { render } from "@react-email/render";
import { createLead } from "@/lib/data/leads";
import { getAgent } from "@/lib/data/agent";
import { getPropertyByIdForAdmin } from "@/lib/data/properties";
import { parseContactFormData } from "@/lib/validation/contact-schema";
import { IDLE_ACTION_STATE, type ActionState } from "@/lib/types/action-state";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { SITE } from "@/lib/content/site";
import { ContactNotificationEmail } from "@/emails/contact-notification";
import { ContactConfirmationEmail } from "@/emails/contact-confirmation";

async function sendContactEmails(lead: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
}): Promise<void> {
  const [agent, property] = await Promise.all([
    getAgent(),
    lead.propertyId ? getPropertyByIdForAdmin(lead.propertyId) : null,
  ]);

  const notificationHtml = await render(
    ContactNotificationEmail({
      siteUrl: SITE.url,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      propertyTitle: property?.title,
      propertyUrl: property ? `${SITE.url}/propiedades/${property.slug}` : undefined,
    }),
  );

  const confirmationHtml = await render(
    ContactConfirmationEmail({
      siteUrl: SITE.url,
      name: lead.name,
      agentName: agent.name,
      agentPhoneDisplay: agent.phone,
    }),
  );

  await Promise.all([
    resend.emails.send({
      from: EMAIL_FROM,
      to: agent.notificationEmail,
      replyTo: lead.email,
      subject: `Nuevo contacto: ${lead.name}`,
      html: notificationHtml,
    }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: lead.email,
      subject: "Gracias por contactar a OtterHaus",
      html: confirmationHtml,
    }),
  ]);
}

export async function submitContactAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseContactFormData(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await createLead(parsed.data);

  try {
    await sendContactEmails(parsed.data);
  } catch (error) {
    console.error("No se pudieron enviar los correos de contacto:", error);
  }

  return {
    status: "success",
    message: "¡Gracias! Te contactaremos a la brevedad.",
  };
}

export { IDLE_ACTION_STATE };
