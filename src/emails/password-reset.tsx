import { Button, Heading, Text } from "@react-email/components";
import { EmailShell, emailColors } from "@/emails/components/email-shell";

export function PasswordResetEmail({ name, resetUrl }: { name: string; resetUrl: string }) {
  const firstName = name.trim().split(" ")[0];

  return (
    <EmailShell preview="Restablece tu contraseña del panel OtterHaus">
      <Heading as="h1" style={{ fontSize: 22, margin: "0 0 16px", color: emailColors.ink }}>
        Hola, {firstName}
      </Heading>

      <Text style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 24px" }}>
        Recibimos una solicitud para restablecer la contraseña de tu cuenta en el panel de
        OtterHaus. Haz clic en el botón para elegir una nueva contraseña. Este enlace expira en
        1 hora.
      </Text>

      <Button
        href={resetUrl}
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
        Restablecer contraseña
      </Button>

      <Text style={{ fontSize: 13, color: emailColors.muted, lineHeight: 1.6, margin: "24px 0 0" }}>
        Si no pediste este cambio, puedes ignorar este correo — tu contraseña actual sigue
        funcionando.
      </Text>
    </EmailShell>
  );
}
