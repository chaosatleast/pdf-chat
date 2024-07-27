"use client";
import useSubscription from "@/hooks/useSubscription";
import { CheckCheckIcon, CopyIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

function CopyTextButton({ message }: { message: string }) {
  const [textToCopy, setTextToCopy] = useState(""); // The text you want to copy
  const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied

  const onCopyText = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };
  useEffect(() => {
    setTextToCopy(message);
  }, [message]);

  const { hasActiveMembership } = useSubscription();

  if (hasActiveMembership) {
    return (
      <div className="border-t mt-4 border-neutral-400 pt-3 pb-1 px-2">
        {!copyStatus && (
          <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
            <div>
              <CopyIcon className="w-4 h-4 text-neutral-400" />
            </div>
          </CopyToClipboard>
        )}
        {copyStatus && <CheckCheckIcon className="w-4 h-4 text-neutral-400" />}
      </div>
    );
  } else {
    <></>;
  }
}

export default CopyTextButton;
