import { useLocalSearchParams } from "expo-router";

import { TOOLS } from "@/features/catalog/domain/tool-catalog";
import { ToolOverviewScreen } from "@/features/catalog/presentation/tool-overview-screen";

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ toolId: tool.id }));
}

export default function ToolRoute() {
  const { toolId } = useLocalSearchParams<{ toolId: string }>();
  return <ToolOverviewScreen toolId={toolId} />;
}
