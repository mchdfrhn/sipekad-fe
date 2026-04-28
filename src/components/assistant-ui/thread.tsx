import {
  ComposerAddAttachment,
  ComposerAttachments,
  UserMessageAttachments,
} from "@/components/assistant-ui/attachment";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ActionBarMorePrimitive,
  ActionBarPrimitive,
  AuiIf,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
} from "@assistant-ui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  GaugeIcon,
  HelpCircleIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RefreshCwIcon,
  SearchIcon,
  SquareIcon,
} from "lucide-react";
import type { FC } from "react";

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root @container flex h-full flex-col bg-transparent text-[#2B3674]"
      style={{
        ["--thread-max-width" as string]: "44rem",
        ["--composer-radius" as string]: "12px",
        ["--composer-padding" as string]: "10px",
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        data-slot="aui_thread-viewport"
        className="relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth bg-[#F4F7FE]"
      >
        <div className="border-b border-[#E2E8F0] bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-[#F4F0FF] text-[#4318FF]">
              <GaugeIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-[#2B3674]">
                Asisten Admin SIPEKAD
              </h2>
              <p className="truncate text-xs text-[#A3AED0]">
                Siap bantu cek alur, data ringkas, dan troubleshooting
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-(--thread-max-width) flex-1 flex-col px-4 pt-4">
          <AuiIf condition={(s) => s.thread.isEmpty}>
            <ThreadWelcome />
          </AuiIf>

          <div
            data-slot="aui_message-group"
            className="mb-10 flex flex-col gap-y-5 empty:hidden"
          >
            <ThreadPrimitive.Messages>
              {() => <ThreadMessage />}
            </ThreadPrimitive.Messages>
            <AuiIf condition={(s) => s.thread.isRunning}>
              <TypingIndicator />
            </AuiIf>
          </div>

          <ThreadPrimitive.ViewportFooter className="aui-thread-viewport-footer sticky bottom-0 mt-auto flex flex-col gap-4 overflow-visible rounded-t-(--composer-radius) bg-transparent pb-4 md:pb-6">
            <ThreadScrollToBottom />
            <Composer />
          </ThreadPrimitive.ViewportFooter>
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadMessage: FC = () => {
  const role = useAuiState((s) => s.message.role);
  const isEditing = useAuiState((s) => s.message.composer.isEditing);

  if (isEditing) return <EditComposer />;
  if (role === "user") return <UserMessage />;
  return <AssistantMessage />;
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full bg-white p-4 text-[#2B3674] shadow-md hover:bg-[#F4F7FE] disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <div className="aui-thread-welcome-root my-auto flex grow flex-col">
      <div className="aui-thread-welcome-center flex w-full grow flex-col items-center justify-center">
        <div className="aui-thread-welcome-message flex size-full flex-col justify-center px-4">
          <h1 className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both text-2xl font-semibold text-[#2B3674] duration-200">
            Mau cek apa hari ini?
          </h1>
          <p className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both max-w-sm text-sm leading-6 text-[#A3AED0] delay-75 duration-200">
            Saya bisa bantu ringkas pengajuan, arahkan menu admin, dan diagnosis error SIPEKAD.
          </p>
        </div>
      </div>
      <ThreadSuggestions />
    </div>
  );
};

const ThreadSuggestions: FC = () => {
  const suggestions = [
    {
      icon: GaugeIcon,
      title: "Ringkas pengajuan",
      prompt: "Ringkas kondisi pengajuan saat ini berdasarkan snapshot data admin.",
    },
    {
      icon: SearchIcon,
      title: "Cari yang perlu diproses",
      prompt: "Apa prioritas admin dari pengajuan terbaru yang ada di snapshot?",
    },
    {
      icon: FileTextIcon,
      title: "Panduan respons",
      prompt: "Bagaimana langkah memberi respons pada pengajuan mahasiswa?",
    },
    {
      icon: HelpCircleIcon,
      title: "Troubleshoot error",
      prompt: "Bantu saya troubleshoot error di halaman admin SIPEKAD.",
    },
  ];

  return (
    <div className="aui-thread-welcome-suggestions grid w-full gap-2 pb-4 @md:grid-cols-2">
      {suggestions.map(({ icon: Icon, title, prompt }) => (
        <ThreadPrimitive.Suggestion key={prompt} prompt={prompt} send asChild>
          <Button
            variant="ghost"
            className="aui-thread-welcome-suggestion h-auto w-full justify-start gap-3 rounded-lg border border-[#E9E3FF] bg-white px-3 py-3 text-start text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4318FF] hover:bg-[#F4F0FF]"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#F4F0FF] text-[#4318FF]">
              <Icon className="size-4" />
            </span>
            <span className="min-w-0 whitespace-normal font-medium leading-5 text-[#2B3674]">
              {title}
            </span>
          </Button>
        </ThreadPrimitive.Suggestion>
      ))}
    </div>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
      <ComposerPrimitive.AttachmentDropzone asChild>
        <div
          data-slot="aui_composer-shell"
          className="flex w-full flex-col gap-2 rounded-(--composer-radius) border border-[#E9E3FF] bg-white p-(--composer-padding) shadow-[0_10px_28px_rgba(31,42,68,0.10)] transition-shadow focus-within:border-[#4318FF]/60 focus-within:ring-2 focus-within:ring-[#4318FF]/25 data-[dragging=true]:border-[#4318FF] data-[dragging=true]:border-dashed data-[dragging=true]:bg-[#F4F0FF]"
        >
          <ComposerAttachments />
          <ComposerPrimitive.Input
            placeholder="Tanya soal pengajuan, user, backup, atau error..."
            className="aui-composer-input max-h-32 min-h-10 w-full resize-none bg-transparent px-1.75 py-1 text-sm text-[#2B3674] outline-none placeholder:text-[#A3AED0]"
            rows={1}
            autoFocus
            aria-label="Message input"
          />
          <ComposerAction />
        </div>
      </ComposerPrimitive.AttachmentDropzone>
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <div className="aui-composer-action-wrapper relative flex items-center justify-between">
      <ComposerAddAttachment />
      <AuiIf condition={(s) => !s.thread.isRunning}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send message"
            side="bottom"
            type="button"
            variant="default"
            size="icon"
            className="aui-composer-send size-8 rounded-full bg-[#4318FF] text-white hover:bg-[#3311CC]"
            aria-label="Send message"
          >
            <ArrowUpIcon className="aui-composer-send-icon size-4" />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </AuiIf>
      <AuiIf condition={(s) => s.thread.isRunning}>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Stop generating"
            side="bottom"
            type="button"
            variant="default"
            size="icon"
            className="aui-composer-cancel size-8 rounded-full bg-[#4318FF] text-white hover:bg-[#3311CC]"
            aria-label="Stop generating"
          >
            <SquareIcon className="aui-composer-cancel-icon size-3 fill-current" />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </AuiIf>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-destructive text-sm">
        <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const TypingIndicator: FC = () => {
  return (
    <div className="fade-in slide-in-from-bottom-1 flex animate-in items-center gap-2 px-2 text-xs text-[#A3AED0] duration-150">
      <span className="grid size-7 place-items-center rounded-full bg-[#F4F0FF] text-[#4318FF]">
        <GaugeIcon className="size-3.5" />
      </span>
      <span className="rounded-full border border-[#E9E3FF] bg-white px-3 py-2 shadow-sm">
        Asisten sedang mengetik
        <span className="ml-1 inline-flex w-5 justify-between align-middle">
          <span className="size-1 animate-bounce rounded-full bg-[#4318FF] [animation-delay:-0.24s]" />
          <span className="size-1 animate-bounce rounded-full bg-[#4318FF] [animation-delay:-0.12s]" />
          <span className="size-1 animate-bounce rounded-full bg-[#4318FF]" />
        </span>
      </span>
    </div>
  );
};

const AssistantMessage: FC = () => {
  // reserves space for action bar and compensates with `-mb` for consistent msg spacing
  // keeps hovered action bar from shifting layout (autohide doesn't support absolute positioning well)
  // for pt-[n] use -mb-[n + 6] & min-h-[n + 6] to preserve compensation
  const ACTION_BAR_PT = "pt-1.5";
  const ACTION_BAR_HEIGHT = `-mb-7.5 min-h-7.5 ${ACTION_BAR_PT}`;

  return (
    <MessagePrimitive.Root
      data-slot="aui_assistant-message-root"
      data-role="assistant"
      className="fade-in slide-in-from-bottom-1 relative animate-in duration-150"
    >
      <div
        data-slot="aui_assistant-message-content"
        className="wrap-break-word rounded-lg border border-[#E9E3FF] bg-white px-4 py-3 text-sm leading-6 text-[#2B3674] shadow-sm [&_li]:my-1 [&_ol]:my-2 [&_ol]:pl-5 [&_p]:my-2 [&_ul]:my-2 [&_ul]:pl-5"
      >
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            tools: { Fallback: ToolFallback },
          }}
        />
        <MessageError />
      </div>

      <div
        data-slot="aui_assistant-message-footer"
        className={cn("ms-2 flex items-center", ACTION_BAR_HEIGHT)}
      >
        <BranchPicker />
        <AssistantActionBar />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
        className="aui-assistant-action-bar-root col-start-3 row-start-2 -ms-1 flex gap-1 text-[#A3AED0]"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <AuiIf condition={(s) => s.message.isCopied}>
            <CheckIcon />
          </AuiIf>
          <AuiIf condition={(s) => !s.message.isCopied}>
            <CopyIcon />
          </AuiIf>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
      <ActionBarMorePrimitive.Root>
        <ActionBarMorePrimitive.Trigger asChild>
          <TooltipIconButton
            tooltip="More"
            className="data-[state=open]:bg-accent"
          >
            <MoreHorizontalIcon />
          </TooltipIconButton>
        </ActionBarMorePrimitive.Trigger>
        <ActionBarMorePrimitive.Content
          side="bottom"
          align="start"
          className="aui-action-bar-more-content z-50 min-w-32 overflow-hidden rounded-md border border-[#E9E3FF] bg-white p-1 text-[#2B3674] shadow-md"
        >
          <ActionBarPrimitive.ExportMarkdown asChild>
            <ActionBarMorePrimitive.Item className="aui-action-bar-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#F4F0FF] focus:bg-[#F4F0FF]">
              <DownloadIcon className="size-4" />
              Export as Markdown
            </ActionBarMorePrimitive.Item>
          </ActionBarPrimitive.ExportMarkdown>
        </ActionBarMorePrimitive.Content>
      </ActionBarMorePrimitive.Root>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      data-slot="aui_user-message-root"
      className="fade-in slide-in-from-bottom-1 grid animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [&:where(>*)]:col-start-2"
      data-role="user"
    >
      <UserMessageAttachments />

      <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
        <div className="aui-user-message-content wrap-break-word peer rounded-lg rounded-tr-sm bg-[#4318FF] px-4 py-2.5 text-sm leading-6 text-white shadow-md empty:hidden">
          <MessagePrimitive.Parts />
        </div>
        <div className="aui-user-action-bar-wrapper absolute start-0 top-1/2 -translate-x-full -translate-y-1/2 pe-2 peer-empty:hidden rtl:translate-x-full">
          <UserActionBar />
        </div>
      </div>

      <BranchPicker
        data-slot="aui_user-branch-picker"
        className="col-span-full col-start-1 row-start-3 -me-1 justify-end"
      />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <MessagePrimitive.Root
      data-slot="aui_edit-composer-wrapper"
      className="flex flex-col px-2"
    >
      <ComposerPrimitive.Root className="aui-edit-composer-root ms-auto flex w-full max-w-[85%] flex-col rounded-lg border border-[#4318FF]/20 bg-white shadow-[0_10px_28px_rgba(31,42,68,0.10)]">
        <ComposerPrimitive.Input
          className="aui-edit-composer-input min-h-14 w-full resize-none bg-transparent p-4 text-sm text-[#2B3674] outline-none"
          autoFocus
        />
        <div className="aui-edit-composer-footer mx-3 mb-3 flex items-center gap-2 self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button size="sm" className="bg-[#4318FF] text-white hover:bg-[#3311CC]">
              Update
            </Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </MessagePrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "aui-branch-picker-root -ms-2 me-2 inline-flex items-center text-[#A3AED0] text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};
