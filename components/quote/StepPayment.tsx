"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { QuoteState } from "@/app/get-quote/page";
import { CreditCard, Lock, ChevronLeft, Loader2, User } from "lucide-react";
import { Session } from "next-auth";

interface Props {
  state: QuoteState;
  session: Session | null;
  onBack: () => void;
  onSuccess: (policyId: string, policyNumber: string) => void;
}

export default function StepPayment({ state, session, onBack, onSuccess }: Props) {
  const router = useRouter();
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authForm, setAuthForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { cover } = state;
  const price = cover
    ? cover.paymentFrequency === "annual"
      ? cover.annualPremium
      : cover.monthlyPremium
    : 0;

  const coverLabels: Record<string, string> = {
    "third-party": "Third Party",
    "third-party-fire-theft": "Third Party, Fire & Theft",
    comprehensive: "Comprehensive",
  };

  function formatCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  function detectBrand(n: string) {
    const num = n.replace(/\s/g, "");
    if (num.startsWith("4")) return "Visa";
    if (num.startsWith("5") || num.startsWith("2")) return "Mastercard";
    if (num.startsWith("34") || num.startsWith("37")) return "Amex";
    return "Card";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    let userId = session?.user?.id;

    // If not logged in, create account or sign in
    if (!userId) {
      if (authMode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: authForm.firstName,
            lastName: authForm.lastName,
            email: authForm.email,
            password: authForm.password,
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          setError(d.error || "Failed to create account");
          setLoading(false);
          return;
        }
      }

      const signInRes = await signIn("credentials", {
        email: authForm.email,
        password: authForm.password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Refresh to get session
      router.refresh();
      await new Promise((r) => setTimeout(r, 500));
    }

    const cardNum = card.number.replace(/\s/g, "");
    const cardLast4 = cardNum.slice(-4);
    const cardBrand = detectBrand(card.number);

    const res = await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicle: state.vehicle,
        drivers: state.drivers,
        address: state.address,
        coverType: cover?.coverType,
        paymentFrequency: cover?.paymentFrequency,
        annualPremium: cover?.annualPremium,
        monthlyPremium: cover?.monthlyPremium,
        payment: {
          cardLast4,
          cardBrand,
          billingName: card.name,
        },
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Payment failed. Please try again.");
      return;
    }

    const policy = await res.json();
    onSuccess(policy.id, policy.policyNumber);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <CreditCard size={24} className="text-blue-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-950">Payment</h2>
          <p className="text-gray-500 text-sm">Secure payment – your cover starts immediately</p>
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-blue-950 text-white rounded-2xl p-6 mb-6">
        <h3 className="font-semibold mb-4 text-blue-200">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-300">Vehicle</span>
            <span>{state.vehicle?.year} {state.vehicle?.make} {state.vehicle?.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Cover</span>
            <span>{coverLabels[cover?.coverType || ""] || cover?.coverType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-300">Drivers</span>
            <span>{state.drivers.length} driver{state.drivers.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="border-t border-blue-800 my-3" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total due today</span>
            <span>£{price.toFixed(2)}</span>
          </div>
          <p className="text-blue-400 text-xs">
            {cover?.paymentFrequency === "monthly"
              ? `£${price.toFixed(2)}/month × 12 = £${(price * 12).toFixed(2)} total`
              : `Annual policy · covers 12 months from today`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Auth section for guests */}
        {!session && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-blue-700" />
              <h3 className="font-semibold text-blue-950">Account Details</h3>
            </div>
            <div className="flex gap-2 mb-5">
              {(["register", "login"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAuthMode(m)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    authMode === m ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {m === "register" ? "Create Account" : "Sign In"}
                </button>
              ))}
            </div>

            {authMode === "register" && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">First name *</label>
                  <input
                    required
                    value={authForm.firstName}
                    onChange={(e) => setAuthForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Last name *</label>
                  <input
                    required
                    value={authForm.lastName}
                    onChange={(e) => setAuthForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email address *</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={authForm.password}
                  onChange={(e) => setAuthForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Card details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-blue-700" />
              <h3 className="font-semibold text-blue-950">Card Details</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Lock size={12} />
              256-bit SSL
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name on card *</label>
              <input
                required
                value={card.name}
                onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="James Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Card number *</label>
              <input
                required
                value={card.number}
                onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {card.number.length >= 1 && (
                <p className="text-xs text-gray-400 mt-1">{detectBrand(card.number)}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Expiry date *</label>
                <input
                  required
                  value={card.expiry}
                  onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CVC *</label>
                <input
                  required
                  value={card.cvc}
                  onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
            <Lock size={11} />
            This is a demo. No real payment is processed. Enter any valid-format card details.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 font-medium px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold py-4 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-60 text-base"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? "Processing..." : `Pay £${price.toFixed(2)} & Get Covered`}
          </button>
        </div>
      </form>
    </div>
  );
}
