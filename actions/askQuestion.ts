"use server";

import { adminDb } from "@/firebaseAdm";
import { auth } from "@clerk/nextjs/server";
import { Message } from "@/custom/Chat";
import { generateLangchainCompletion } from "@/langchain";
import { Elsie_Swash_Caps } from "next/font/google";

const FREE_LIMIT = 3;
const PRO_LIMIT = 100;

export async function askQuestion(id: string, question: string) {
  auth().protect();
  const { userId } = await auth();

  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  const humanMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(humanMessage);

  const reply = await generateLangchainCompletion(id, question);

  const botMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  if (reply) {
    await chatRef.add(botMessage);
    return {
      success: true,
      message: null,
    };
  } else {
    return {
      success: false,
      message: null,
    };
  }
}
