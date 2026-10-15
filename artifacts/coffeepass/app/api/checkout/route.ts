import { getAuthenticatedUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getLang } from "@/lib/i18n";
import { getStripeClient } from "@/lib/stripe";
import { getUsdSandboxQuote } from "@/lib/stripe-sandbox-pricing";
import { isPlanId } from "@/lib/data";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export const runtime = "nodejs";

const jsonHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  let orderId: string | null = null;

  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json(
        { error: "UNAUTHENTICATED" },
        { status: 401, headers: jsonHeaders },
      );
    }

    const rawBody = await request.text();
    if (rawBody.length > 2_048) {
      return Response.json(
        { error: "INVALID_INPUT" },
        { status: 413, headers: jsonHeaders },
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return Response.json(
        { error: "INVALID_INPUT" },
        { status: 400, headers: jsonHeaders },
      );
    }

    const planId =
      body && typeof body === "object" && "planId" in body
        ? body.planId
        : undefined;
    if (!isPlanId(planId)) {
      return Response.json(
        { error: "INVALID_PLAN" },
        { status: 400, headers: jsonHeaders },
      );
    }

    await connectDB();
    const product = await Product.findOne({
      slug: planId,
      category: "membership",
    }).exec();

    if (!product) {
      return Response.json(
        { error: "PLAN_NOT_FOUND" },
        { status: 404, headers: jsonHeaders },
      );
    }

    const kwdAmountFils = Math.round(product.price * 1_000);
    if (
      product.currency !== "KWD" ||
      !Number.isSafeInteger(kwdAmountFils) ||
      kwdAmountFils <= 0
    ) {
      return Response.json(
        { error: "INVALID_PLAN_PRICE" },
        { status: 409, headers: jsonHeaders },
      );
    }

    const checkoutQuote = getUsdSandboxQuote(product.price);

    const lang = await getLang();
    const order = await Order.create({
      user: user.id,
      items: [
        {
          product: product._id,
          productSlug: product.slug,
          productName: product.name,
          productNameAr: product.nameAr,
          quantity: 1,
          price: product.price,
        },
      ],
      total: product.price,
      currency: "KWD",
      stripeCheckoutAmountCents: checkoutQuote.amountCents,
      stripeCheckoutCurrency: checkoutQuote.currency,
      kwdToUsdTestRate: checkoutQuote.rate,
      status: "pending",
    });
    orderId = order.id;

    const stripe = getStripeClient();
    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        allowed_payment_method_types: ["card"],
        locale: lang,
        customer_email: user.email,
        client_reference_id: user.id,
        metadata: {
          orderId: order.id,
          userId: user.id,
          productId: product.id,
          planId: product.slug,
        },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: checkoutQuote.stripeCurrency,
              unit_amount: checkoutQuote.amountCents,
              product_data: {
                name: lang === "ar" ? product.nameAr : product.name,
                description:
                  lang === "ar" ? product.descriptionAr : product.description,
              },
            },
          },
        ],
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
      },
      { idempotencyKey: `coffeepass-order-${order.id}` },
    );

    if (!session.url) {
      throw new Error("STRIPE_CHECKOUT_URL_MISSING");
    }

    await Order.updateOne(
      { _id: order._id, status: "pending" },
      { $set: { stripeCheckoutSessionId: session.id } },
    ).exec();

    return Response.json(
      { url: session.url },
      { headers: jsonHeaders },
    );
  } catch {
    if (orderId) {
      await Order.updateOne(
        { _id: orderId, status: "pending" },
        { $set: { status: "cancelled" } },
      )
        .exec()
        .catch(() => undefined);
    }
    return Response.json(
      { error: "CHECKOUT_UNAVAILABLE" },
      { status: 503, headers: jsonHeaders },
    );
  }
}
