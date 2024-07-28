import { Spotlight } from "@/custom/ui/Spotlight";
import {
  BrainCogIcon,
  ChevronRight,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";

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
    <main className="dark:bg-black min-h-screen flex flex-col  items-center  px-10 pb-28">
      <div className="h-[40rem] lg:h-[35rem] pt-28 w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.04] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          <p className="mb-8 font-medium text-2xl text-neutral-300 max-w-lg text-center mx-auto">
            Your Best Document Companion
          </p>
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Transforming Your PDFs into Interactive Conversations
          </h1>
          <h3 className=" max-w-lg font-light mx-auto text-center text-2xl mt-8">
            Introducing <span className="font-bold">DocPal</span>
          </h3>
          <p className="mt-8 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            Upload your document, and our chatbot will summarize content for you
            and answers to all your questions. Ideal for everyone,{" "}
            <span className="font-bold">DocPal</span> turns static documents
            into dynamic conversations, enhancing productivity 10x fold
            effortlessly
          </p>
        </div>
      </div>
      <div className="relative mb-4">
        <img
          className=" w-full lg:max-w-5xl mx-auto shadow-lg"
          src="/image.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black from-5%" />
      </div>
      <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(var(--azurelane-blue),0.6)_0%,rgba(var(--azurelane-blue),0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        </span>
        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-900 p-4 px-10  ring-1 ring-white/10 ">
          <Link className="text-lg" href={"/dashboard"}>
            Get Started{" "}
          </Link>
          <ChevronRight className="w-4 h-4" />
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-[rgba(var(--azurelane-purple),0)] via-[rgba(var(--azurelane-purple),0.9)] to-[rgb(var(--azurelane-purple),0)] transition-opacity duration-500 group-hover:opacity-40"></span>
      </button>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8 text-md ">
        {features.map((feature, index) => (
          <div
            key={index}
            className="
          relative
          overflow-hidden
          p-px
          justify-center rounded-md
          text-sm text-neutral-300 h-36 my-auto w-full"
          >
            <div
              className="absolute -inset-[200%]
            animate-[spin_3s_linear_infinite] 
            bg-[conic-gradient(from_90deg_at_50%_50%,rgba(var(--horizon-blue),1)_0%,rgba(var(--horizon-yellow),1)_70%,rgba(var(--azurelane-blue),1)_100%)]"
            />
            <div
              className="
          bg-black
            p-6 rounded-md
            flex items-center  h-full justify-center gap-x-2 backdrop-blur-3xl "
            >
              <div className="flex item-start gap-x-2 px-4">
                <dt className="inline font-bold pt-px">
                  <feature.icon className="w-4 h-4" />
                </dt>
                <dd>
                  <span className="font-bold"> {feature.name} </span>
                  <span>{feature.description}</span>
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
