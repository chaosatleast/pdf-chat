import type { Metadata } from "next";
import { Inter } from "next/font/google";

import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Header from "@/custom/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Analyze your pdf with AI Chatbot",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkLoaded>
      {/* Header */}

      <div className="flex flex-col h-screen flex-1">
        <Header />
        <main className="overflow-y-auto flex-1">{children}</main>
      </div>
    </ClerkLoaded>
  );
}
