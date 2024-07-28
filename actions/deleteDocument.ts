"use server";

import { adminDb, adminStorage } from "@/firebaseAdm";
import { indexName } from "@/langchain";
import pineconeClient from "@/pinecone";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(docId: string) {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .delete();

  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error("FIREBASE_STORAGE_BUCKET is missing");
  }

  await adminStorage
    .bucket(process.env.FIREBASE_STORAGE_BUCKET)
    .file(`users/${userId}/files/${docId}`)
    .delete();

  // delete embedding
  const index = await pineconeClient.index(indexName);
  await index.namespace(docId).deleteAll();

  revalidatePath("/dashboard");
}
