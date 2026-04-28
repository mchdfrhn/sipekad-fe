
import { useChat } from "@ai-sdk/react";
import { useAISDKRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { TextStreamChatTransport } from "ai";
import { AssistantModal } from "./assistant-modal";
import { TooltipProvider } from "@/components/ui/tooltip";
import BASE_URL from "@/utils/api/index.js";
import { useMemo } from "react";

export function AdminChatAssistant() {
  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: `${BASE_URL}/ai/chat`,
        headers: () => ({
          Authorization: `Bearer ${localStorage.getItem("tokenKey") || ""}`,
        }),
      }),
    [],
  );

  const chat = useChat({
    transport,
    onError: (e) => {
      console.error("[AI Chat Frontend Error]:", e);
    }
  });

  const runtime = useAISDKRuntime(chat);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <TooltipProvider>
        <AssistantModal />
      </TooltipProvider>
    </AssistantRuntimeProvider>
  );
}
