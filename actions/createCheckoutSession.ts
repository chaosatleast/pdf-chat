"use server";

import { adminDb } from "@/firebaseAdm";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import stripe from "@/stripe";
import { UserDetails } from "@/app/dashboard/upgrade/page";
import { getBaseUrl } from "@/getBaseUrl";

export async function createCheckoutSession(userDetails: UserDetails) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let stripeCustomerId;

  const user = await adminDb.collection("users").doc(userId).get();

  stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    // create customer stripe id

    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId: userId,
      },
    });

    await adminDb.collection("users").doc(userId).set({
      stripeCustomerId: customer.id,
    });

    stripeCustomerId = customer.id;
  }

  // stripe checkout session

  if (!process.env.STRIPE_PRICE_ID) {
    throw new Error("STRIPE_PRICE_ID is missing");
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: stripeCustomerId,
    success_url: `${getBaseUrl()}/dashboard/upgrade?success=true`,
    cancel_url: `${getBaseUrl()}/upgrade`,
  });

  return session.id;
}
