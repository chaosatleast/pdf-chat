"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { orderBy, collection, query } from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Loader2Icon, BotMessageSquareIcon, CopyIcon } from "lucide-react";
import { start } from "repl";
import { askQuestion } from "@/actions/askQuestion";
import BotChatBubble from "./BotChatBubble";
import HumanChatBubble from "./HumanChatBubble";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [textToCopy, setTextToCopy] = useState(""); // The text you want to copy
  const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied

  const bottomChatRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    if (!snapshot) return;
    console.log("Message Updated", snapshot.docs);

    const lastMessage = messages.pop();

    if (
      lastMessage?.role === "ai" &&
      lastMessage.message === "I am thinking ... "
    ) {
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();
      return { id: doc.id, role, message, createdAt: createdAt.toDate() };
    });

    setMessages(newMessages);
  }, [snapshot]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const temp = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: temp,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "I am thinking ... ",
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, temp);

      if (!success) {
        // Toast error message
        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: `Opps...${message}`,
              createdAt: new Date(),
            },
          ])
        );
      } else {
        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: `${message}`,
              createdAt: new Date(),
            },
          ])
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex-1 w-full ">
        {loading ? (
          <div className="flex justify-center items-center ">
            <Loader2Icon className="animate-spin h-20 w-20 mt-20" />
          </div>
        ) : (
          <div className="overflow-y-auto flex  flex-col p-5 gap-y-8 dark:text-neutral-200 text-md">
            {messages.length === 0 && (
              <BotChatBubble message=" Ask me anything about the docs!" />
            )}

            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "ai" && message.message !== null ? (
                  <BotChatBubble message={message.message} />
                ) : (
                  <HumanChatBubble message={message.message} />
                )}
              </div>
            ))}

            <div ref={bottomChatRef} />
          </div>
        )}
      </div>

      <form
        className="sticky bottom-0
        dark:bg-zinc-900
        bg-gray-700 flex gap-x-2 p-4"
        onSubmit={handleSubmit}
      >
        <Input
          className="bg-transparent  focus:ring-transparent"
          placeholder="Ask a question ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={!input || isPending} className="">
          {isPending ? <Loader2Icon className="animate-spin" /> : "Ask"}
        </Button>
      </form>
    </div>
  );
}

export default Chat;
