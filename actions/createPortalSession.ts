"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdm";
import { getBaseUrl } from "@/getBaseUrl";
import stripe from "@/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createPortalSession() {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let stripeCustomerId;

  const user = await adminDb.collection("users").doc(userId).get();

  stripeCustomerId = user.data()?.stripeCustomerId;

  console.log(stripeCustomerId);

  if (!stripeCustomerId) {
    // create customer stripe id
    throw new Error("stripe customer id is missing ");
  }

  // stripe checkout session
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseUrl()}/dashboard/upgrade`,
  });

  return session.url;
}
