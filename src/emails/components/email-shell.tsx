import { Body, Container, Head, Hr, Html, Img, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

const COLORS = {
  bg: "#f5f5f0",
  card: "#ffffff",
  ink: "#1d1b16",
  muted: "#6b6558",
  border: "#e8e4d9",
};

export function EmailShell({
  preview,
  siteUrl,
  children,
}: {
  preview: string;
  siteUrl: string;
  children: ReactNode;
}) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: COLORS.bg,
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: COLORS.ink,
          margin: 0,
          padding: "32px 16px",
        }}
      >
        <Container
          style={{
            maxWidth: 480,
            margin: "0 auto",
            backgroundColor: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Section style={{ padding: "32px 32px 16px", textAlign: "center" }}>
            <Img
              src={`${siteUrl}/image/logo-full.png`}
              width="120"
              alt="OtterHaus"
              style={{ margin: "0 auto" }}
            />
          </Section>
          <Hr style={{ borderColor: COLORS.border, margin: 0 }} />
          <Section style={{ padding: "32px" }}>{children}</Section>
          <Hr style={{ borderColor: COLORS.border, margin: 0 }} />
          <Section style={{ padding: "20px 32px", textAlign: "center" }}>
            <Text style={{ fontSize: 12, color: COLORS.muted, margin: 0 }}>
              OtterHaus Propiedades — Santiago, Chile
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailColors = COLORS;
