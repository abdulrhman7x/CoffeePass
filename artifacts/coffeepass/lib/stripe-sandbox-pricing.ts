/**
 * CODED Day 5 Sandbox-only quote:
 * 1 KWD = 3.25 USD. This fixed classwork rate is not a production FX rate.
 */
export const KWD_TO_USD_TEST_RATE = 3.25;
export const USD_TEST_CURRENCY = "USD" as const;
export const STRIPE_USD_TEST_CURRENCY = "usd" as const;

const KWD_FILS_TO_USD_CENTS_NUMERATOR = 13;
const KWD_FILS_TO_USD_CENTS_DENOMINATOR = 40;

export function getUsdSandboxQuote(kwdAmount: number) {
  if (!Number.isFinite(kwdAmount) || kwdAmount <= 0) {
    throw new Error("INVALID_KWD_AMOUNT");
  }

  const scaledKwdAmount = kwdAmount * 1_000;
  const kwdAmountFils = Math.round(scaledKwdAmount);
  if (
    !Number.isSafeInteger(kwdAmountFils) ||
    kwdAmountFils <= 0 ||
    Math.abs(scaledKwdAmount - kwdAmountFils) > 1e-7
  ) {
    throw new Error("INVALID_KWD_AMOUNT");
  }

  // USD cents = KWD fils * (3.25 * 100 / 1,000) = fils * 13 / 40.
  const numerator = kwdAmountFils * KWD_FILS_TO_USD_CENTS_NUMERATOR;
  if (!Number.isSafeInteger(numerator) || numerator > Number.MAX_SAFE_INTEGER - 20) {
    throw new Error("USD_AMOUNT_OUT_OF_RANGE");
  }

  // Integer arithmetic rounds positive half-cent values up.
  const amountCents = Math.floor(
    (numerator + KWD_FILS_TO_USD_CENTS_DENOMINATOR / 2) /
      KWD_FILS_TO_USD_CENTS_DENOMINATOR,
  );
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new Error("USD_AMOUNT_OUT_OF_RANGE");
  }

  return {
    kwdAmountFils,
    amountCents,
    currency: USD_TEST_CURRENCY,
    stripeCurrency: STRIPE_USD_TEST_CURRENCY,
    rate: KWD_TO_USD_TEST_RATE,
  };
}
