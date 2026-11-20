import { useEffect, useRef, useState, type FormEvent } from "react";
import { pay, site } from "../content";
import { Footer } from "./Footer";

/**
 * /pay: Stripe's embedded Checkout form, hand-wired like everything else.
 * The customer names an amount, the Lambda in lambda/pay creates a Checkout
 * Session for it, and Stripe.js renders the form in an iframe. Stripe sends
 * the customer back here with ?session_id= once they've paid.
 * /pay?amount=250 prefills the amount.
 */

// PCI rules: Stripe.js must be loaded from js.stripe.com, never bundled.
const STRIPE_JS = "https://js.stripe.com/dahlia/stripe.js";

// The slice of Stripe.js this page uses.
type CheckoutForm = {
  mount(selector: string): void;
  on(event: "confirm", handler: (event: unknown) => void): void;
};
type LoadActionsResult =
  | { type: "success"; actions: { confirm(options: { formConfirmEvent: unknown }): Promise<unknown> } }
  | { type: "error"; error: { message: string } };
type CheckoutFormSdk = {
  createForm(options?: { layout?: "expanded" | "compact" }): CheckoutForm;
  loadActions(): Promise<LoadActionsResult>;
};
type StripeInstance = {
  initCheckoutFormSdk(options: {
    clientSecret: string;
    appearance?: Record<string, unknown>;
  }): CheckoutFormSdk;
};
declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeInstance;
  }
}

// Stripe's "night" theme, retuned to the site palette (see :root tokens).
const appearance = {
  theme: "night",
  inputs: "spaced",
  labels: "auto",
  variables: {
    borderRadius: "4px",
    colorBackground: "#0e0e15",
    colorDanger: "#ff6b6b",
    colorPrimary: "#ffb703",
    colorSuccess: "#00c853",
    colorText: "#eae8e3",
    fontFamily: "system-ui, sans-serif",
    fontSizeBase: "16px",
    spacingUnit: "4px",
  },
};

type Session = {
  status: "open" | "complete" | "expired";
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  currency: string | null;
};

type Phase =
  | { name: "amount" | "loading" | "checking" | "form" }
  | { name: "error"; message: string }
  | { name: "result"; session: Session };

function loadStripeJs(): Promise<NonNullable<Window["Stripe"]>> {
  return new Promise((resolve, reject) => {
    if (window.Stripe) return resolve(window.Stripe);
    const script = document.createElement("script");
    script.src = STRIPE_JS;
    script.onload = () =>
      window.Stripe ? resolve(window.Stripe) : reject(new Error("Stripe.js did not initialize"));
    script.onerror = () => reject(new Error("Stripe.js failed to load"));
    document.head.append(script);
  });
}

async function api<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(pay.api + path, {
    method: body ? "POST" : "GET",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  return res.json();
}

function money(amount: number | null, currency: string | null) {
  if (amount == null || !currency) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

/** "$1,250.50" → 125050 cents; null unless it's a valid amount within bounds. */
function parseAmount(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const cents = Math.round(Number(cleaned) * 100);
  return cents >= pay.minAmount * 100 && cents <= pay.maxAmount * 100 ? cents : null;
}

export default function Pay() {
  const query = new URLSearchParams(window.location.search);
  const sessionId = query.get("session_id");
  const [phase, setPhase] = useState<Phase>({ name: sessionId ? "checking" : "amount" });
  const [input, setInput] = useState(query.get("amount") ?? "");
  const [invalid, setInvalid] = useState(false);
  const [amount, setAmount] = useState<string | null>(null);
  // StrictMode runs effects twice in dev; one status lookup is enough.
  const started = useRef(false);

  useEffect(() => {
    document.title = `${pay.title} · MKGZ LLC`;
    if (!sessionId || started.current) return;
    started.current = true;
    api<Session>(`/status/${encodeURIComponent(sessionId)}`)
      .then((session) => {
        setAmount(money(session.amount_total, session.currency));
        setPhase({ name: "result", session });
      })
      .catch((err) => {
        console.error(err);
        setPhase({ name: "error", message: "Couldn't confirm the payment status." });
      });
  }, [sessionId]);

  const startCheckout = async (cents: number) => {
    setPhase({ name: "loading" });
    try {
      const [Stripe, session] = await Promise.all([
        loadStripeJs(),
        api<{ client_secret: string; amount_total: number | null; currency: string | null }>(
          "/session",
          { amount: cents },
        ),
      ]);
      setAmount(money(session.amount_total, session.currency));

      const checkout = Stripe(pay.publishableKey).initCheckoutFormSdk({
        clientSecret: session.client_secret,
        appearance,
      });
      const form = checkout.createForm({ layout: "expanded" });
      form.mount("#checkout-form");
      setPhase({ name: "form" });

      const loaded = await checkout.loadActions();
      if (loaded.type === "error") throw new Error(loaded.error.message);
      form.on("confirm", async (event) => {
        // Stripe shows card errors inside the form; this catches the rest.
        try {
          await loaded.actions.confirm({ formConfirmEvent: event });
        } catch (err) {
          console.error("Payment confirmation error:", err);
        }
      });
    } catch (err) {
      console.error(err);
      setPhase({ name: "error", message: "Couldn't load the payment form." });
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cents = parseAmount(input);
    setInvalid(cents === null);
    if (cents !== null) void startCheckout(cents);
  };

  return (
    <>
      <main>
        <section className="section pay">
          <a className="mono-label pay-back" href="/">
            ← MKGZ.ME
          </a>
          <div className="section-heading">
            <span className="section-index">PAY</span>
            <h1 className="section-title">{pay.title}</h1>
            <hr className="pay-rule" />
          </div>

          {phase.name === "result" ? (
            <Result session={phase.session} amount={amount} />
          ) : (
            <p className="pay-lede">{pay.lede}</p>
          )}

          {phase.name === "amount" && (
            <form className="pay-amount-form" onSubmit={onSubmit} noValidate>
              <label className="mono-label" htmlFor="pay-amount">
                AMOUNT (USD)
              </label>
              <div className="pay-amount-row">
                <span className="pay-amount-field">
                  <span aria-hidden="true">$</span>
                  <input
                    id="pay-amount"
                    inputMode="decimal"
                    autoComplete="off"
                    autoFocus
                    placeholder="0.00"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    aria-invalid={invalid}
                    aria-describedby="pay-amount-hint"
                  />
                </span>
                <button className="pay-continue" type="submit">
                  CONTINUE →
                </button>
              </div>
              <p
                id="pay-amount-hint"
                className={`mono-label pay-hint${invalid ? " is-invalid" : ""}`}
                role={invalid ? "alert" : undefined}
              >
                {invalid ? "ENTER AN AMOUNT " : ""}BETWEEN ${pay.minAmount.toLocaleString("en-US")}{" "}
                AND ${pay.maxAmount.toLocaleString("en-US")}
              </p>
            </form>
          )}

          {phase.name === "form" && amount && (
            <p className="pay-amount">
              {amount}{" "}
              <a className="mono-label pay-change" href="/pay">
                CHANGE
              </a>
            </p>
          )}

          {(phase.name === "loading" || phase.name === "checking") && (
            <p className="mono-label pay-status" role="status">
              {phase.name === "loading" ? "LOADING SECURE FORM…" : "CONFIRMING PAYMENT…"}
            </p>
          )}
          {phase.name === "error" && (
            <p className="mono-label pay-status" role="alert">
              {phase.message} <a href={sessionId ? window.location.href : "/pay"}>TRY AGAIN</a> OR
              EMAIL <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          )}

          {/* Stripe mounts its iframe here; it has to exist before startCheckout runs. */}
          {!sessionId && <div id="checkout-form" className="pay-form" />}
        </section>
      </main>
      <Footer />
    </>
  );
}

function Result({ session, amount }: { session: Session; amount: string | null }) {
  if (session.status === "complete" && session.payment_status !== "unpaid") {
    return (
      <>
        <p className="mono-label">PAYMENT RECEIVED</p>
        <p className="pay-result">Thank you{amount ? `. ${amount} paid.` : "."}</p>
        <p className="pay-lede pay-status">
          Stripe is emailing your receipt. Questions?{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </>
    );
  }
  if (session.status === "complete") {
    return (
      <>
        <p className="mono-label">PAYMENT PROCESSING</p>
        <p className="pay-result">Your payment is on its way.</p>
        <p className="pay-lede pay-status">
          Some payment methods take a little while to clear. Stripe will email you when it
          completes.
        </p>
      </>
    );
  }
  return (
    <>
      <p className="mono-label">NOT PAID</p>
      <p className="pay-result">That payment didn't go through.</p>
      <p className="pay-lede pay-status">
        You haven't been charged. <a href="/pay">Try again</a> or email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </>
  );
}
