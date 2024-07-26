import { adminDb } from "@/firebaseAdm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

export async function POST(req: NextRequest) {
  const headersList = headers();
  const body = await req.text();

  const sig = headersList.get("stripe-signature");
  if (!sig) {
    return new Response(`No sig`, { status: 400 });
  }

  let webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse(`STRIPE_WEBHOOK_SECRET is missing`, {
      status: 400,
    });
  }

  let event: Stripe.Event;

  const stripe = new Stripe(webhookSecret);

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  const getUserDetails = async (customerId: string) => {
    const userDoc = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

    if (!userDoc.empty) {
      return userDoc.docs[0];
    }
  };
  // Handle the event
  switch (event?.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const userDetails = await getUserDetails(customerId);

      if (!userDetails?.id) {
        return new Response(`User not found`, { status: 400 });
      }

      //   Update subscription
      await adminDb.collection("users").doc(userDetails.id).set({
        hasActiveMembership: true,
      });

      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    }

    case "customer.subscription.deleted":
    case "subscription_schedule.canceled": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.customer as string;

      const userDoc = await getUserDetails(userId);

      if (!userDoc?.id) {
        return new Response(`User not found`, { status: 400 });
      }

      await adminDb.collection("users").doc(userDoc.id).set({
        hasActiveMembership: false,
      });

      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event?.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ message: "webhook triggered", status: 200 });
}
