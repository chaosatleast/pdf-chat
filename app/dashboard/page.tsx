import Documents from "@/custom/Documents";
import React from "react";

export const dynamic = "force-dynamic";

function Dashboard() {
  return (
    <div className="max-w-7xl h-full  mx-auto">
      <h1 className="text-3xl p-5 font-extralight">My Docs</h1>
      <Documents />
    </div>
  );
}

export default Dashboard;
