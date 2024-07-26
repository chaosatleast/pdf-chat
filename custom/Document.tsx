"use client";
import { useRouter } from "next/navigation";
import React from "react";
import byteSize from "byte-size";

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
    <div className="flex flex-col bg-gray-200 w-72 h-96 text-gray-600 gap-y-2 rounded-md p-4">
      <div
        className="flex-1"
        onClick={() => router.push(`/dashboard/files/${id}`)}
      >
        <p className="truncate">{name}</p>
        <p className="text-sm text-gray">{byteSize(size).value} KB</p>
      </div>
    </div>
  );
}

export default Document;
