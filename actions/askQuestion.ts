"use server";

import { adminDb } from "@/firebaseAdm";
import { auth } from "@clerk/nextjs/server";
import { Message } from "@/custom/Chat";
import { generateLangchainCompletion } from "@/langchain";
import { Elsie_Swash_Caps } from "next/font/google";
import { limit } from "firebase/firestore";

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

  const userRef = await adminDb.collection("users").doc(userId!).get();

  // check user message / doc

  if (!userRef.data()?.hasActiveMembership) {
    if (userMessages.length > FREE_LIMIT) {
      return {
        success: false,
        message:
          "You have reached the message FREE limit for this document. Consider to upgrade to PRO Account for more message limit.",
      };
    }
  }

  const humanMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(humanMessage);

  const reply = await generateLangchainCompletion(id, question);

  console.log(reply);

  const botMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  if (reply) {
    await chatRef.add(botMessage);
    return {
      success: true,
      message: reply,
    };
  } else {
    return {
      success: false,
      message: reply,
    };
  }
}
