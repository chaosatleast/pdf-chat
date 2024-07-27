import React from "react";
import PlaceholderDocument from "./PlaceholderDocument";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdm";
import Document from "./Document";

async function Documents() {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const documenSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  return (
    <div
      className=" 

      flex items-center justify-center flex-wrap gap-5
    dark:bg-zinc-900"
    >
      {/* Placeholder Documents */}
      <PlaceholderDocument />
      {documenSnapshot.docs.map((doc) => {
        const { name, downloadUrl, size } = doc.data();
        return (
          <Document
            name={name}
            downloadUrl={downloadUrl}
            size={size}
            key={doc.id}
            id={doc.id}
          />
        );
      })}
    </div>
  );
}

export default Documents;
