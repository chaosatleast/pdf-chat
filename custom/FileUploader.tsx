"use client";
import { useToast } from "@/components/ui/use-toast";
import useSubscription from "@/hooks/useSubscription";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const radius = 80;

const circumference = 2 * Math.PI * radius;

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const { hasActiveMembership, isOverFileLimit, fileLoading } =
    useSubscription();

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);

    if (isOverFileLimit) {
      toast({
        title: "FREE plan has reached limit",
        description:
          "You have reached the maximum file limit. Please consider to upgrade to PRO plan.",

        variant: "destructive",
      });
    } else if (isOverFileLimit && hasActiveMembership) {
      toast({
        variant: "destructive",
        title: "Reached the maximum number of document uploads",
        description:
          "You have reached the maximum file limit. Please remove some of the old docs.",
      });
    } else {
      const file = acceptedFiles[0];

      if (file) {
        await handleUpload(file);

        console.log(fileId);
      } else {
        //do nothing ...
      }
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
    [StatusText.UPLOADING]: (
      <div className=" relative">
        <svg className="transform -rotate-90 h-48 w-48 ">
          <circle
            cx="100"
            cy="100"
            r={`${radius}`}
            stroke="currentColor"
            stroke-width="6"
            fill="transparent"
            className="text-gray-700"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="rgba(var(--horizon-blue),1)" />
              <stop offset="50%" stop-color="rgba(var(--azurelane-blue),1)" />
              <stop offset="100%" stop-color="rgba(var(--horizon-yellow),1)" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r={`${radius}`}
            stroke="url(#gradient)"
            stroke-width="6"
            fill="transparent"
            strokeLinecap="round"
            stroke-dasharray={`${circumference}`}
            stroke-dashoffset={`${circumference * (1 - progress / 100)} `}
          />
        </svg>
        <span className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-neutral-300">
          {progress && <> {progress} %</>} {!progress && <>0 %</>}
        </span>
      </div>
    ),
    [StatusText.UPLOADED]: (
      <div className="relative">
        <svg height={"0"} width={"0"}>
          <linearGradient
            id="gradient"
            className="animate-[spin_3s_linear_infinite]"
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(var(--horizon-blue),1)" />
            <stop offset="50%" stopColor="rgba(var(--azurelane-blue),1)" />
            <stop offset="100%" stopColor="rgba(var(--horizon-yellow),1)" />
          </linearGradient>
        </svg>
        <CheckCircle
          className="h-32 w-32 "
          style={{ stroke: "url(#gradient)" }}
        />
      </div>
    ),
    [StatusText.SAVING]: (
      <div className="relative">
        <svg height={"0"} width={"0"}>
          <linearGradient
            className="animate-[spin_3s_linear_infinite]"
            id="gradient"
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(var(--horizon-blue),1)" />
            <stop offset="50%" stopColor="rgba(var(--azurelane-blue),1)" />
            <stop offset="100%" stopColor="rgba(var(--horizon-yellow),1)" />
          </linearGradient>
        </svg>
        <SaveIcon className="h-32 w-32" style={{ stroke: "url(#gradient)" }} />
      </div>
    ),
    [StatusText.GENERATING]: (
      <div className="relative">
        <svg height={"0"} width={"0"}>
          <linearGradient
            className="animate-[spin_3s_linear_infinite]"
            id="gradient"
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(var(--horizon-blue),1)" />
            <stop offset="50%" stopColor="rgba(var(--azurelane-blue),1)" />
            <stop offset="100%" stopColor="rgba(var(--horizon-yellow),1)" />
          </linearGradient>
        </svg>
        <HammerIcon
          className="h-32 w-32"
          style={{ stroke: "url(#gradient)" }}
        />
      </div>
    ),
  };

  return (
    <div className="  max-w-7xl mx-auto  ">
      \
      {uploadInProgress ? (
        <div className="dark:bg-zinc-900 dark:text-neutral-300 bg-slate-300  rounded-lg h-96  flex flex-col items-center gap-y-12 justify-center mt-10">
          {
            //   @ts-ignore
            statusIcons[status!]
          }
          <div>
            <p>{status}</p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            " dark:bg-zinc-900 dark:text-neutral-300 bg-slate-300  rounded-lg h-96  flex justify-center mt-10",
            `${isFocused || isDragAccept ? `bg-gray-300` : `bg-gray-100`}`
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-y-12 w-full">
            {isDragActive ? (
              <>
                <RocketIcon className="h-32 w-32 animate-bounce" />
                <p>Drop the files here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-32 w-32 animate-bounce" />
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
