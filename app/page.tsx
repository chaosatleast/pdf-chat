import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  Zap,
  ZapIcon,
} from "lucide-react";

const features = [
  {
    name: "Store your PDF Documents.",
    description:
      "Keep all your important PDF files securely stored and easily accessible anytime, anywhere.",
    icon: GlobeIcon,
  },
  {
    name: "Blazing Fast Responses.",
    description:
      "Experience lightning-fast answers to your queries, ensuring you to get the information you need instantly.",
    icon: ZapIcon,
  },
  {
    name: "Chat Memorization.",
    description:
      "Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience.",
    icon: BrainCogIcon,
  },
  {
    name: "Interactive PDF Viewer.",
    description:
      "Engage with your PDFs like never before using our intuitive and interactive viewer.",
    icon: EyeIcon,
  },
  {
    name: "Cloud Backup.",
    description:
      "Rest assured knowing your documents are safely backup on the cloud protected from lost or damage.",
    icon: ServerCogIcon,
  },
  {
    name: "Responsive Across Device.",
    description:
      "Access and chat with your PDF's seamlessly on any device whether on desktop, tablet or smartphone.",
    icon: MonitorSmartphoneIcon,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col  items-center  p-10">
      <h1>Your Best Document Companion</h1>
      <h1 className="text-5xl text-center font-medium mt-10 px-24">
        Transforming Your PDFs into Interactive Conversations
      </h1>
      <div className="mt-5">
        Introducing <span className="font-bold">DocPal</span>
      </div>
      <div className="text-center mt-10  md:px-10 lg:px-24">
        Upload your document, and our chatbot will summarize content for you and
        answers to all your questions. Ideal for everyone, DocPal turns static
        documents into dynamic conversations, enhancing productivity 10x fold
        effortlessly
      </div>
      <Button className="w-fit mt-20">
        <Link href="/dashboard">Get Started</Link>
      </Button>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div className="flex items-start justify-center gap-x-1 p-2">
            <dt className="inline font-semibold">
              <feature.icon />
            </dt>
            <dd>
              <span className="font-bold"> {feature.name} </span>
              <span>{feature.description}</span>
            </dd>
          </div>
        ))}
      </div>
    </main>
  );
}
