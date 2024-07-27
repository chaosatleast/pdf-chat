"use client";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function PlaceholderDocument() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/dashboard/upload");
  };
  return (
    <Button
      onClick={handleClick}
      className="flex flex-col dark:bg-zinc-400 bg-gray-200 
      w-52 h-72 text-gray-600 dark:text-zinc-950  text-md
      gap-y-2 rounded-md "
    >
      <PlusCircleIcon className="h-16 w-16" />
      <p> Add a document</p>
    </Button>
  );
}

export default PlaceholderDocument;
