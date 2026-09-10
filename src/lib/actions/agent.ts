"use server";

import { refresh, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { updateAgent } from "@/lib/data/agent";
import { parseAgentFormData, type AgentFormValues } from "@/lib/validation/agent-schema";
import type { ActionState } from "@/lib/types/action-state";
import type { AgentInput, SocialLink, SocialPlatform } from "@/lib/types/agent";

function toAgentInput(values: AgentFormValues): AgentInput {
  const socialFields: [SocialPlatform, string | undefined][] = [
    ["instagram", values.instagramUrl],
    ["facebook", values.facebookUrl],
    ["linkedin", values.linkedinUrl],
    ["youtube", values.youtubeUrl],
    ["tiktok", values.tiktokUrl],
  ];
  const socials: SocialLink[] = socialFields
    .filter(([, url]) => Boolean(url))
    .map(([platform, url]) => ({ platform, url: url! }));

  return {
    name: values.name,
    role: values.role,
    photoUrl: values.photoUrl,
    bio: values.bio,
    shortBio: values.shortBio,
    email: values.email,
    phone: values.phone,
    whatsapp: values.whatsapp,
    coverageZones: values.coverageZones,
    credentials: values.credentials,
    stats: [
      { label: values.stat1Label, value: values.stat1Value },
      { label: values.stat2Label, value: values.stat2Value },
      { label: values.stat3Label, value: values.stat3Value },
    ],
    socials,
  };
}

export async function updateAgentAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseAgentFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = toAgentInput(parsed.data);
  await updateAgent(input);
  updateTag("agent");
  refresh();
  return { status: "success", message: "Perfil actualizado." };
}
