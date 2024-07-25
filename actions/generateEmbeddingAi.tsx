"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  auth().protect();

  await generateEmbeddingsInPineconeVectorStore(docId);

  revalidatePath("/dashboard");

  return { completed: true };
}
