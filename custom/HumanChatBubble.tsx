import React from "react";
import CopyTextButton from "./CopyTextButton";

function HumanChatBubble({ message }: { message: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="
                    dark:bg-zinc-500
                    bg-blue-100 w-fit p-2 px-4  rounded-lg max-w-[75%]  "
      >
        <p className="leading-6">{message}</p>
        <CopyTextButton message={message} />
      </div>
    </div>
  );
}

export default HumanChatBubble;
