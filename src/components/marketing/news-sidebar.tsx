import { getAgent } from "@/lib/data/agent";
import { NewsAgentCard } from "@/components/marketing/news-agent-card";

export async function NewsSidebar() {
  const agent = await getAgent();
  return <NewsAgentCard agent={agent} />;
}
