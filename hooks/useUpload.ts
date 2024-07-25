"use client";
import { generateEmbeddings } from "@/actions/generateEmbeddingAi";
import { db, storage } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
  UPLOADING = "Uploading file ...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database",
  GENERATING = "Generating AI Embeddings, This might  take a few seconds ...",
}

export type Status = StatusText[keyof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | any>(null);
  const [fileId, setFileId] = useState<string | any>(null);
  const [status, setStatus] = useState<Status | any>(null);
  const { user } = useUser();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;
    // Free | Pro Tier

    // GenerateID
    const fileIdToBeUpload = uuidv4();

    const storageRef = ref(
      storage,
      `/users/${user.id}/files/${fileIdToBeUpload}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setProgress(percent);
        setStatus(StatusText.UPLOADING);
      },
      (error) => {
        console.error("Error uploading file : ", error);
      },
      async () => {
        setStatus(StatusText.UPLOADED);

        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

        setStatus(StatusText.SAVING);

        await setDoc(doc(db, "users", user.id, "files", fileIdToBeUpload), {
          name: file.name,
          size: file.size,
          type: file.type,
          downloadUrl: downloadUrl,
          ref: uploadTask.snapshot.ref.fullPath,
          createdAt: new Date(),
        });

        setStatus(StatusText.GENERATING);

        await generateEmbeddings(fileIdToBeUpload);

        setFileId(fileIdToBeUpload);
      }
    );
  };
  return { progress, status, fileId, handleUpload };
}

export default useUpload;
