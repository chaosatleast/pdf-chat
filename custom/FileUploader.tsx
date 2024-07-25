"use client";
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import {
  CheckCheckIcon,
  CheckCircle,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();

  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);

    const file = acceptedFiles[0];

    if (file) {
      await handleUpload(file);

      console.log(fileId);
    } else {
      //do nothing ...
    }
  }, []);

  const { getRootProps, getInputProps, isDragAccept, isDragActive, isFocused } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: <RocketIcon className="h-20 w-20" />,
    [StatusText.UPLOADED]: <CheckCircle className="h-20 w-20" />,
    [StatusText.SAVING]: <CircleArrowDown className="h-20 w-20" />,
    [StatusText.GENERATING]: <HammerIcon className="h-20 w-20" />,
  };

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl max-auto  ">
      {uploadInProgress ? (
        <div className="w-[90%] bg-gray-100 h-96 mt-10 flex flex-col items-center gap-y-10 justify-center">
          {
            //   @ts-ignore
            statusIcons[status!]
          }
          <div>
            <p>{status}</p>
          </div>
          <div className="w-[65%]">
            <div
              className={`w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700`}
            >
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "p-10 bg-slate-300 border-b border-gray-200 w-[90%] rounded-lg h-96 flex gap-y-10 flex-col items-center  justify-center mt-10",
            `${isFocused || isDragAccept ? `bg-gray-300` : `bg-gray-100`}`
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-y-12 w-full">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-bounce" />
                <p>Drop the files here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
