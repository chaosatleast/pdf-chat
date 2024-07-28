"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useSubscription from "@/hooks/useSubscription";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function PlaceholderDocument() {
  const { isOverFileLimit } = useSubscription();

  const router = useRouter();

  const { toast } = useToast();

  const handleClick = () => {
    if (isOverFileLimit) {
      router.push("/dashboard/upgrade");
      toast({
        title: "FREE Plan has reached limit",
        description:
          "You have reached the maximum file limit. Please consider to upgrade to PRO plan.",
        variant: "destructive",
      });
    } else {
      router.push("/dashboard/upload");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex flex-col dark:bg-zinc-400 bg-gray-200 
     w-64 h-72 text-gray-600 dark:text-zinc-950  text-md
      gap-y-2 rounded-md "
    >
      <PlusCircleIcon className="h-16 w-16" />
      <p> Add a document</p>
    </Button>
  );
}

export default PlaceholderDocument;
