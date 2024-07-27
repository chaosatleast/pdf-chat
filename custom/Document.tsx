"use client";
import { useRouter } from "next/navigation";
import React from "react";
import byteSize from "byte-size";
import {
  DeleteIcon,
  DownloadCloudIcon,
  RemoveFormattingIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div
      className=" 
      group/action
      dark:bg-zinc-300
      dark:text-zinc-900
      flex flex-col
     bg-gray-200 w-52 h-72 text-gray-600 gap-y-2 rounded-lg p-4"
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
          className="group/save bg-slate-200 border-blue-500 hover:bg-blue-500"
        >
          <DownloadCloudIcon className="text-blue-500 group-hover/save:text-neutral-200 group-focus/save:text-neutral-200" />
        </Button>
        <Button
          variant={"outline"}
          className="group/trash bg-slate-200 border-red-500  hover:bg-red-500"
        >
          <Trash2Icon className="text-red-500 group-hover/trash:text-neutral-200 group-focus/trash:text-neutral-200" />
        </Button>
      </div>
    </div>
  );
}

export default Document;
