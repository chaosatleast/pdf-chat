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
      className="flex flex-col bg-gray-200 w-72 h-96 text-gray-600 gap-y-2 rounded-md"
    >
      <PlusCircleIcon className="h-16 w-16" />
      <p> Add a document</p>
    </Button>
  );
}

export default PlaceholderDocument;
