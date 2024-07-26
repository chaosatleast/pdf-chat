import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div className="flex justify-between shadow-sm bg-white p-5 border-b">
      <Link className="text-2xl" href={"/dashboard"}>
        DocPal
      </Link>
      <SignedIn>
        <div className=" flex items-center space-x-2">
          <Button asChild variant={"link"} className="hidden md:flex">
            <Link href={"/dashboard/upgrade"}>Pricing</Link>
          </Button>
          <Button asChild variant={"outline"}>
            <Link href={"/dashboard"}>My Docs</Link>
          </Button>
          <Button asChild variant={"outline"}>
            <Link href={"/dashboard/upload"}>
              <FilePlus2 />
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
