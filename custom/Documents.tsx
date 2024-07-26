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
    <div className="flex flex-wrap bg-gray-100 p-5 justify-center md:justify-start rounded-sm gap-5 max-w-7xl mx-auto ">
      {/* Placeholder Documents */}

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
      <PlaceholderDocument />
    </div>
  );
}

export default Documents;
