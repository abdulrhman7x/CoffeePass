import type Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";
import { getUsdSandboxQuote } from "@/lib/stripe-sandbox-pricing";
import { Order } from "@/models/Order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const jsonHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json(
      { error: "MISSING_SIGNATURE" },
      { status: 400, headers: jsonHeaders },
    );
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 1_000_000) {
      return Response.json(
        { error: "PAYLOAD_TOO_LARGE" },
        { status: 413, headers: jsonHeaders },
      );
    }

    event = getStripeClient().webhooks.constructEvent(
      rawBody,
      signature,
      getStripeWebhookSecret(),
    );
  } catch {
    return Response.json(
      { error: "INVALID_WEBHOOK_SIGNATURE" },
      { status: 400, headers: jsonHeaders },
    );
  }

  if (event.livemode) {
    return Response.json(
      { error: "LIVE_MODE_NOT_ALLOWED" },
      { status: 400, headers: jsonHeaders },
    );
  }

  try {
    await connectDB();

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      if (
        session.livemode ||
        session.mode !== "payment" ||
        session.payment_status !== "paid"
      ) {
        return Response.json({ received: true }, { headers: jsonHeaders });
      }

      const { orderId, userId, productId, planId } = session.metadata ?? {};
      if (!orderId || !userId || !productId || !planId) {
        return Response.json(
          { error: "MISSING_ORDER_METADATA" },
          { status: 400, headers: jsonHeaders },
        );
      }

      const order = await Order.findById(orderId).exec();
      if (!order) {
        return Response.json(
          { error: "ORDER_NOT_FOUND" },
          { status: 500, headers: jsonHeaders },
        );
      }

      const item = order.items[0];
      const expectedQuote = getUsdSandboxQuote(order.total);
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? undefined);

      if (
        order.user.toString() !== userId ||
        item?.product.toString() !== productId ||
        item?.productSlug !== planId ||
        order.currency !== "KWD" ||
        order.stripeCheckoutCurrency !== expectedQuote.currency ||
        order.kwdToUsdTestRate !== expectedQuote.rate ||
        order.stripeCheckoutAmountCents !== expectedQuote.amountCents ||
        session.currency !== expectedQuote.stripeCurrency ||
        session.amount_total !== order.stripeCheckoutAmountCents ||
        order.stripeCheckoutSessionId !== session.id
      ) {
        return Response.json(
          { error: "ORDER_VALIDATION_FAILED" },
          { status: 400, headers: jsonHeaders },
        );
      }

      await Order.updateOne(
        {
          _id: order._id,
          stripeCheckoutSessionId: session.id,
          status: { $in: ["pending", "cancelled"] },
        },
        {
          $set: {
            status: "paid",
            ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
            paidAt: new Date(),
          },
        },
      ).exec();

      return Response.json({ received: true }, { headers: jsonHeaders });
    }

    if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.livemode) {
        return Response.json({ received: true }, { headers: jsonHeaders });
      }

      await Order.updateOne(
        {
          stripeCheckoutSessionId: session.id,
          status: "pending",
        },
        { $set: { status: "cancelled" } },
      ).exec();
    }

    return Response.json({ received: true }, { headers: jsonHeaders });
  } catch {
    return Response.json(
      { error: "WEBHOOK_PROCESSING_FAILED" },
      { status: 500, headers: jsonHeaders },
    );
  }
}
