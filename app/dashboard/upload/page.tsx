import { Toaster } from "@/components/ui/toaster";
import FileUploader from "@/custom/FileUploader";
import React from "react";

function Upload() {
  return (
    <div>
      <Toaster />
      <FileUploader />
    </div>
  );
}

export default Upload;
