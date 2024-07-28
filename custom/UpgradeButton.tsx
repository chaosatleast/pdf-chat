"use client";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import { Loader2Icon, StarIcon } from "lucide-react";
import React, { useTransition } from "react";
import Link from "next/link";
import { createPortalSession } from "@/actions/createPortalSession";
import { useRouter } from "next/navigation";

function UpgradeButton() {
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccount = () => {
    startTransition(async () => {
      const stripePortalUrl = await createPortalSession();
      router.push(stripePortalUrl);
    });
  };

  if (!hasActiveMembership && !loading) {
    return (
      <Button variant={"outline"} className="bg-black border-neutral-500">
        <Link href="/dashboard/upgrade" className="flex gap-x-2 items-center">
          Upgrade <StarIcon className="h-4 w-4 fill-yellow-500 text-white" />
        </Link>
      </Button>
    );
  }

  if (loading) {
    return (
      <Button variant={"outline"} className="bg-black border-neutral-500">
        <Loader2Icon className="animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAccount}
      disabled={isPending}
      variant={"outline"}
      className="bg-black border-neutral-500"
    >
      {isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <p>
          <span className="font-extrabold">PRO</span> Account
        </p>
      )}
    </Button>
  );
}

export default UpgradeButton;
