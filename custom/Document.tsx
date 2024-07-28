"use client";
import { deleteDocument } from "@/actions/deleteDocument";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import byteSize from "byte-size";
import { DownloadCloudIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function Document({
  id,
  name,
  size,
  downloadUrl,
}: {
  size: number;
  id: string;
  name: string;
  downloadUrl: string;
}) {
  const router = useRouter();

  const [isDeleting, startTransaction] = useTransition();
  const { hasActiveMembership } = useSubscription();

  const handleDelete = () => {
    const prompt = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (prompt) {
      startTransaction(async () => {
        await deleteDocument(id);
      });
    }
  };

  return (
    <div
      className=" 
      group/action
      dark:bg-zinc-300
      dark:text-zinc-900
      flex flex-col
     bg-gray-200 w-64 h-72 text-gray-600 gap-y-2 rounded-lg p-4"
    >
      <div
        className="flex-1"
        onClick={() => router.push(`/dashboard/files/${id}`)}
      >
        <p className="text-ellipsis line-clamp-2 font-medium text-lg">{name}</p>
        <p className="text-sm text-gray-500">{byteSize(size).value} KB</p>
      </div>
      <div className="flex invisible justify-end gap-2 group-hover/action:visible">
        <Button
          variant={"outline"}
          className="group/save bg-neutral-200 border-blue-500 hover:bg-blue-500"
        >
          <a href={downloadUrl}>
            <DownloadCloudIcon className="text-blue-500 group-hover/save:text-neutral-200 group-focus/save:text-neutral-200" />
          </a>
        </Button>
        <Button
          disabled={isDeleting || !hasActiveMembership}
          onClick={handleDelete}
          variant={"outline"}
          className="group/trash bg-neutral-200 border-red-500  hover:bg-red-500 flex items-center gap-x-2"
        >
          {!hasActiveMembership && (
            <p className="text-red-500 text-xs">PRO feature </p>
          )}
          <Trash2Icon className="h-4 w-4 text-red-500 group-hover/trash:text-neutral-200 group-focus/trash:text-neutral-200" />
        </Button>
      </div>
    </div>
  );
}

export default Document;
