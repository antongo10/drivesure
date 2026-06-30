"use client";

import { useEffect, useState } from "react";
import { VehicleData, DriverData, CoverData } from "@/app/get-quote/page";
import { Shield, Check, ChevronRight, ChevronLeft, Loader2, Zap, Car, Flame } from "lucide-react";

interface Props {
  vehicle: VehicleData;
  drivers: DriverData[];
  data: CoverData | null;
  onBack: () => void;
  onNext: (c: CoverData) => void;
}

type AllPrices = {
  "third-party": { annual: number; monthly: number };
  "third-party-fire-theft": { annual: number; monthly: number };
  comprehensive: { annual: number; monthly: number };
};

const COVERS = [
  {
    type: "third-party" as const,
    name: "Third Party",
    tagline: "Minimum legal cover",
    icon: <Car size={22} />,
    color: "from-slate-600 to-slate-700",
    features: [
      "Third party liability",
      "Legal expenses cover",
      "EU driving cover (90 days)",
    ],
    notIncluded: ["Fire or theft cover", "Accidental damage to your car"],
  },
  {
    type: "third-party-fire-theft" as const,
    name: "Fire & Theft",
    fullName: "Third Party, Fire & Theft",
    tagline: "Popular choice",
    icon: <Flame size={22} />,
    color: "from-orange-600 to-orange-700",
    badge: "Popular",
    features: [
      "Everything in Third Party",
      "Fire damage cover",
      "Theft & attempted theft",
      "Vandalism after break-in",
    ],
    notIncluded: ["Accidental damage to your car"],
  },
  {
    type: "comprehensive" as const,
    name: "Comprehensive",
    tagline: "Our most complete cover",
    icon: <Shield size={22} />,
    color: "from-blue-600 to-blue-700",
    badge: "Best Value",
    features: [
      "Everything in Fire & Theft",
      "Accidental damage to your car",
      "Windscreen & glass cover",
      "Courtesy car while yours is repaired",
      "Personal accident cover",
    ],
    notIncluded: [],
  },
] as const;

export default function StepCover({ vehicle, drivers, data, onBack, onNext }: Props) {
  const [allPrices, setAllPrices] = useState<AllPrices | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CoverData["coverType"]>(
    data?.coverType || "comprehensive"
  );
  const [frequency, setFrequency] = useState<"annual" | "monthly">(
    data?.paymentFrequency || "annual"
  );

  // Fetch all 3 prices in parallel once on mount — no re-fetch on cover type change
  useEffect(() => {
    const types = ["third-party", "third-party-fire-theft", "comprehensive"] as const;
    setLoading(true);
    Promise.all(
      types.map((coverType) =>
        fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicle, drivers, coverType }),
        }).then((r) => r.json())
      )
    ).then(([tp, tpft, comp]) => {
      setAllPrices({
        "third-party": tp,
        "third-party-fire-theft": tpft,
        comprehensive: comp,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally only on mount

  function handleNext() {
    if (!allPrices) return;
    const p = allPrices[selected];
    onNext({
      coverType: selected,
      paymentFrequency: frequency,
      annualPremium: p.annual,
      monthlyPremium: p.monthly,
    });
  }

  const selectedPrices = allPrices?.[selected];
  const displayPrice = selectedPrices
    ? frequency === "annual"
      ? selectedPrices.annual
      : selectedPrices.monthly
    : null;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-950 mb-1">Choose Your Cover</h2>
        <p className="text-gray-400 text-sm">All prices calculated for your specific vehicle and drivers</p>
      </div>

      {/* Payment frequency toggle */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-1.5 mb-6 flex gap-1">
        {(["annual", "monthly"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFrequency(f)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              frequency === f
                ? "bg-blue-700 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pay {f === "annual" ? "Annually" : "Monthly"}
            {f === "annual" && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${frequency === "annual" ? "bg-blue-600" : "bg-green-100 text-green-700"}`}>
                Save 5%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cover cards */}
      <div className="space-y-3">
        {COVERS.map((cover) => {
          const prices = allPrices?.[cover.type];
          const price = prices ? (frequency === "annual" ? prices.annual : prices.monthly) : null;
          const isSelected = selected === cover.type;
          const isCheapest = allPrices && cover.type === "third-party";
          const savingVsComp = allPrices && cover.type !== "comprehensive"
            ? allPrices.comprehensive[frequency === "annual" ? "annual" : "monthly"] - (price || 0)
            : null;

          return (
            <button
              key={cover.type}
              type="button"
              onClick={() => setSelected(cover.type)}
              className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 shadow-lg shadow-blue-100"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              {/* Card header */}
              <div className={`flex items-center justify-between px-5 py-4 bg-gradient-to-r ${cover.color}`}>
                <div className="flex items-center gap-3 text-white">
                  <div className="opacity-90">{cover.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{"fullName" in cover ? cover.fullName : cover.name}</span>
                      {"badge" in cover && cover.badge && (
                        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                          {cover.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-white/70 text-xs">{cover.tagline}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  {loading ? (
                    <Loader2 size={20} className="animate-spin text-white/70" />
                  ) : price !== null ? (
                    <div>
                      <div className="text-white font-black text-2xl leading-none">
                        £{price.toFixed(0)}
                        <span className="text-sm font-normal opacity-80">
                          .{(price % 1).toFixed(2).slice(2)}
                        </span>
                      </div>
                      <div className="text-white/70 text-xs">
                        per {frequency === "annual" ? "year" : "month"}
                      </div>
                      {savingVsComp && savingVsComp > 0 && (
                        <div className="text-yellow-300 text-xs font-semibold mt-0.5">
                          Save £{savingVsComp.toFixed(0)}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Features */}
              <div className={`px-5 py-4 bg-white ${isSelected ? "" : ""}`}>
                <div className="grid grid-cols-1 gap-1.5">
                  {cover.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check size={10} className="text-green-600" />
                      </div>
                      {f}
                    </div>
                  ))}
                  {cover.notIncluded.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-gray-400 text-xs font-bold">✕</span>
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                {/* Selected indicator */}
                <div className="flex items-center justify-end mt-3">
                  <div className={`flex items-center gap-2 text-xs font-semibold transition-all ${
                    isSelected ? "text-blue-700" : "text-gray-300"
                  }`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? "border-blue-500 bg-blue-500" : "border-gray-200"
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    {isSelected ? "Selected" : "Select"}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary bar */}
      {allPrices && !loading && (
        <div className="bg-blue-950 rounded-2xl p-5 mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-blue-300 text-sm">Your selected cover</p>
            <p className="text-white font-bold">
              {selected === "third-party-fire-theft"
                ? "Third Party, Fire & Theft"
                : selected === "comprehensive"
                ? "Comprehensive"
                : "Third Party"}
            </p>
          </div>
          <div className="text-right">
            {displayPrice !== null && (
              <>
                <p className="text-white font-black text-3xl">£{displayPrice?.toFixed(2)}</p>
                <p className="text-blue-400 text-xs">per {frequency === "annual" ? "year" : "month"}</p>
                {frequency === "monthly" && selectedPrices && (
                  <p className="text-blue-400 text-xs mt-0.5">
                    Annual total: £{(selectedPrices.monthly * 12).toFixed(2)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* EV callout */}
      {vehicle.fuelType === "Electric" && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mt-3 flex items-center gap-3 text-sm text-green-800">
          <Zap size={16} className="shrink-0 text-green-600" />
          <span>Electric vehicle discount has been applied to your quote</span>
        </div>
      )}

      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-medium px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!allPrices || loading}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : null}
          Continue to Payment
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
