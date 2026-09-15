import { Button, Heading, Hr, Text } from "@react-email/components";
import { EmailShell, emailColors } from "@/emails/components/email-shell";

export function ContactConfirmationEmail({
  siteUrl,
  name,
  agentName,
  agentRole,
  agentPhoneDisplay,
}: {
  siteUrl: string;
  name: string;
  agentName: string;
  agentRole: string;
  agentPhoneDisplay: string;
}) {
  const firstName = name.trim().split(" ")[0];

  return (
    <EmailShell preview="Recibimos tu mensaje — te contactaremos pronto">
      <Heading as="h1" style={{ fontSize: 22, margin: "0 0 16px", color: emailColors.ink }}>
        ¡Gracias, {firstName}!
      </Heading>

      <Text style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 16px" }}>
        Recibimos tu mensaje y {agentName} te va a contactar a la brevedad para ayudarte con lo
        que necesites.
      </Text>

      <Text style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 24px" }}>
        Si tu consulta es urgente, también puedes escribirnos directo por WhatsApp al{" "}
        {agentPhoneDisplay}.
      </Text>

      <Button
        href={`${siteUrl}/propiedades`}
        style={{
          backgroundColor: "#d4af37",
          color: "#0b0d12",
          borderRadius: 999,
          padding: "12px 28px",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Ver propiedades disponibles
      </Button>

      <Hr style={{ borderColor: emailColors.border, margin: "28px 0 16px" }} />

      <Text style={{ fontSize: 13, color: emailColors.muted, lineHeight: 1.6, margin: 0 }}>
        {agentName}
        <br />
        {agentRole}
        <br />
        {agentPhoneDisplay}
      </Text>
    </EmailShell>
  );
}
