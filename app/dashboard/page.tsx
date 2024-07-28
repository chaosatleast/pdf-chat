import { Toaster } from "@/components/ui/toaster";
import Documents from "@/custom/Documents";
import React from "react";

export const dynamic = "force-dynamic";

function Dashboard() {
  return (
    <div className="h-full p-5 pb-20">
      <div className="  max-w-7xl mx-auto dark:bg-zinc-900 rounded-lg px-5 ">
        <h1 className="text-3xl py-5 font-extralight">My Docs</h1>
        <Documents />
      </div>
      <Toaster />
    </div>
  );
}

export default Dashboard;
