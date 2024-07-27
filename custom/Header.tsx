import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div
      className="
    dark:bg-black dark:text-neutral-200
    flex justify-between  items-center shadow-sm bg-white p-5 border-b"
    >
      <Link className="text-2xl font-bold" href={"/dashboard"}>
        DocPal.
      </Link>
      <SignedIn>
        <div className=" flex items-center space-x-2">
          <Button asChild variant={"link"} className="hidden md:flex">
            <Link href={"/dashboard/upgrade"}>Pricing</Link>
          </Button>
          <Button
            asChild
            variant={"outline"}
            className="bg-black border-neutral-500"
          >
            <Link href={"/dashboard"}>My Docs</Link>
          </Button>
          <Button
            asChild
            variant={"outline"}
            className="bg-black border-neutral-500"
          >
            <Link href={"/dashboard/upload"}>
              <FilePlus2 className="h-4 w-4" />
            </Link>
          </Button>
          <div className="">
            <UserButton />
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default Header;
