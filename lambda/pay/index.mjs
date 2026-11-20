// Checkout Session endpoints for mkgz.me/pay.
//
// Runs as an AWS Lambda (Node.js 22) behind a Function URL, which Amplify
// reverse-proxies at /api/pay/*. No dependencies, so this file can be pasted
// straight into the Lambda console editor.
//
//   POST /session        body {"amount": <cents>}; create a Checkout Session
//                        for that amount and return its client secret
//   GET  /status/{id}    report whether a session was paid
//
// Environment variables:
//   STRIPE_SECRET_KEY    sk_live_… or sk_test_… (required)
//   RETURN_URL           page Stripe sends the customer back to
//                        (optional, defaults to https://mkgz.me/pay)

const STRIPE_API = "https://api.stripe.com/v1";
const { STRIPE_SECRET_KEY, RETURN_URL = "https://mkgz.me/pay" } = process.env;

// The customer names the amount, in cents. Keep in sync with src/content.ts.
const MIN_AMOUNT = 50_00;
const MAX_AMOUNT = 5000_00;
const CURRENCY = "usd";
const PRODUCT_NAME = "Consultation";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "content-type": "application/json", "cache-control": "no-store" },
  body: JSON.stringify(body),
});

async function stripe(method, path, params) {
  const res = await fetch(STRIPE_API + path, {
    method,
    headers: { authorization: `Bearer ${STRIPE_SECRET_KEY}` },
    body: params && new URLSearchParams(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Stripe ${res.status}: ${data.error?.message ?? "unknown error"}`);
  }
  return data;
}

function readAmount(event) {
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString()
      : event.body;
    const { amount } = JSON.parse(raw);
    return Number.isInteger(amount) && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT
      ? amount
      : null;
  } catch {
    return null;
  }
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method;
  const path = (event.rawPath ?? "").replace(/\/+$/, "");

  try {
    if (method === "POST" && path.endsWith("/session")) {
      const amount = readAmount(event);
      if (amount === null) {
        return json(400, {
          error: `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT} cents`,
        });
      }
      const session = await stripe("POST", "/checkout/sessions", {
        mode: "payment",
        ui_mode: "form",
        "line_items[0][price_data][currency]": CURRENCY,
        "line_items[0][price_data][unit_amount]": String(amount),
        "line_items[0][price_data][product_data][name]": PRODUCT_NAME,
        "line_items[0][quantity]": "1",
        billing_address_collection: "auto",
        submit_type: "auto",
        integration_identifier: "custom_embedded_web_0004",
        return_url: `${RETURN_URL}?session_id={CHECKOUT_SESSION_ID}`,
      });
      return json(200, {
        client_secret: session.client_secret,
        amount_total: session.amount_total,
        currency: session.currency,
      });
    }

    const status = method === "GET" && path.match(/\/status\/(cs_[A-Za-z0-9_]+)$/);
    if (status) {
      const session = await stripe("GET", `/checkout/sessions/${status[1]}`);
      return json(200, {
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
      });
    }

    return json(404, { error: "Not found" });
  } catch (err) {
    console.error(err);
    return json(502, { error: "Payment service unavailable" });
  }
};
