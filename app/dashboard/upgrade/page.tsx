"use client";
import { createPortalSession } from "@/actions/createPortalSession";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import getStripe from "@/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { createPortal } from "react-dom";

export type UserDetails = {
  email: string;
  name: string;
};

function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();

  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };

    // stripe checkout session

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        // create stripe portal
        // purpose : customize membership => cancel | continue
        const url = await createPortalSession();
        return router.push(`${url}`);
      }

      const sessionId = await createCheckoutSession(userDetails);

      await stripe?.redirectToCheckout({ sessionId });
    });
  };

  return (
    <div className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <div>
          <h2 className="font-extralight text-xl mb-10"> Pricing</h2>
          <p className="text-6xl font-bold">Supercharge your DOCs Companion</p>
          <p className=" text-center max-w-lg mx-auto leading-8 mt-6">
            Choose an affordable plan thats packed with the best features for
            interacting with your PDFs, enhancing productivity, and streamlining
            your workflow.
          </p>

          <div className="max-w-md mx-auto mt-10 md:max-w-4xl  space-y-4  md:space-y-0 md:space-x-4 grid grid-cols-1 md:grid-cols-2">
            <div className="rounded-md ring-1  p-8 h-full pb-8 ring-gray-600 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-xl"> Starter Plan</h3>
                <p className="text-sm my-4">Explore Core Features at No Cost</p>
                <p>
                  <span className="text-5xl font-bold">Free</span>
                </p>

                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-neutral-400"
                >
                  <li className="flex gap-x-3">
                    <CheckIcon className="w-5 h-6 text-green-600" />
                    Upload Documents with maximum 3.
                  </li>
                  <li className="flex gap-x-3">
                    <CheckIcon className="w-5 h-6 text-green-600" />
                    Send up to 3 messages per document
                  </li>
                  <li className="flex gap-x-3">
                    <CheckIcon className="w-5 h-6 text-green-600" />
                    Try out AI Chat Functionality
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-md ring-1  p-8 h-fit pb-8 ring-gray-600 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-xl">Advanced Plan</h3>
                <p className="text-sm my-4">
                  Experience the full potential of the product by unlocking all
                  features.
                </p>
                <p>
                  <span className="text-5xl font-bold ">
                    RM 9.99{" "}
                    <span className="text-sm text-gray-400"> / month</span>
                  </span>
                </p>

                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-neutral-400"
                >
                  <li className="flex gap-x-3 text-left">
                    <div className="">
                      <CheckIcon className="w-5 h-6 text-green-600 " />
                    </div>
                    <>Uploads Documents with maximum 20.</>
                  </li>
                  <li className="flex gap-x-3">
                    <CheckIcon className="w-5 h-6 text-green-600" />
                    Send up to 100 messages per document
                  </li>
                  <li className="flex gap-x-3">
                    <CheckIcon className="w-5 h-6 text-green-600" />
                    Try out AI Chat Functionality
                  </li>
                  <li className="flex gap-x-3">
                    <CheckIcon className="w-5 h-6 text-green-600" />
                    Copy Chat Function
                  </li>
                </ul>
              </div>
              <div className="">
                <Button
                  className="mt-4 w-full"
                  variant={"default"}
                  disabled={loading || isPending}
                  onClick={handleUpgrade}
                >
                  {isPending || loading
                    ? "Loading ..."
                    : hasActiveMembership
                    ? "Cancel Subscription"
                    : "Subscribe"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
