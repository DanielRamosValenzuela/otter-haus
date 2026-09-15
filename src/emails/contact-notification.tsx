import { Heading, Link, Section, Text } from "@react-email/components";
import { EmailShell, emailColors } from "@/emails/components/email-shell";

export function ContactNotificationEmail({
  name,
  email,
  phone,
  message,
  propertyTitle,
  propertyUrl,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyTitle?: string;
  propertyUrl?: string;
}) {
  return (
    <EmailShell preview={`Nuevo mensaje de contacto de ${name}`}>
      <Heading as="h1" style={{ fontSize: 22, margin: "0 0 16px", color: emailColors.ink }}>
        Nuevo mensaje de contacto
      </Heading>

      {propertyTitle && (
        <Text style={{ fontSize: 14, color: emailColors.muted, margin: "0 0 16px" }}>
          Sobre la propiedad:{" "}
          {propertyUrl ? (
            <Link href={propertyUrl} style={{ color: emailColors.ink }}>
              {propertyTitle}
            </Link>
          ) : (
            propertyTitle
          )}
        </Text>
      )}

      <Section style={{ margin: "0 0 20px" }}>
        <Text style={{ fontSize: 15, margin: "0 0 4px" }}>
          <strong>Nombre:</strong> {name}
        </Text>
        <Text style={{ fontSize: 15, margin: "0 0 4px" }}>
          <strong>Correo:</strong> <Link href={`mailto:${email}`}>{email}</Link>
        </Text>
        {phone && (
          <Text style={{ fontSize: 15, margin: "0 0 4px" }}>
            <strong>Teléfono:</strong> {phone}
          </Text>
        )}
      </Section>

      <Section
        style={{
          backgroundColor: emailColors.bg,
          borderRadius: 8,
          padding: "16px 20px",
        }}
      >
        <Text style={{ fontSize: 15, whiteSpace: "pre-wrap", margin: 0 }}>{message}</Text>
      </Section>
    </EmailShell>
  );
}
