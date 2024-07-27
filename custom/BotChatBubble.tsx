import { BotMessageSquareIcon } from "lucide-react";
import React from "react";
import CopyTextButton from "./CopyTextButton";

function BotChatBubble({ message }: { message: string }) {
  return (
    <div className="flex justify-start items-end gap-x-2">
      <div
        className="
        dark:bg-black 
        w-fit p-2 rounded-full "
      >
        <BotMessageSquareIcon className="h-4 w-4" />
      </div>
      <div
        className="
        dark:bg-zinc-700
        bg-gray-300 w-fit p-2 px-4 rounded-lg max-w-[75%]"
      >
        <p className="leading-7">{message}</p>
        <CopyTextButton message={message} />
      </div>
    </div>
  );
}

export default BotChatBubble;
