import { getAgent } from "@/lib/data/agent";
import { AgentCinematic } from "@/components/marketing/agent-cinematic";

export async function AgentTeaser() {
  const agent = await getAgent();
  return <AgentCinematic agent={agent} />;
}
