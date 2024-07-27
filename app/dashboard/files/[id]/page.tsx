import React from "react";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdm";
import PDFView from "@/custom/PDFView";
import Chat from "@/custom/Chat";

const FilePage = async ({ params: { id } }: { params: { id: string } }) => {
  auth().protect();

  const { userId } = await auth();

  const ref = await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .get();

  const url = ref.data()?.downloadUrl;

  return (
    <div className="grid grid-cols-5 h-full overflow-hidden">
      {/* PDF View */}
      <div className="col-span-5 order-last overflow-y-auto lg:order-first lg:col-span-3 dark:bg-zinc-800 overflow-auto">
        <PDFView url={url} />
      </div>
      {/* Chat */}
      <div className="col-span-5 lg:col-span-2  dark:bg-zinc-900  overflow-auto ">
        <Chat id={id} />
      </div>
    </div>
  );
};

export default FilePage;
