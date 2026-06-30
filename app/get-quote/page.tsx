"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StepVehicle from "@/components/quote/StepVehicle";
import StepDrivers from "@/components/quote/StepDrivers";
import StepAddress from "@/components/quote/StepAddress";
import StepCover from "@/components/quote/StepCover";
import StepPayment from "@/components/quote/StepPayment";
import StepSuccess from "@/components/quote/StepSuccess";
import { Check, Car, Users, MapPin, Shield, CreditCard, ArrowLeft } from "lucide-react";

const STEPS = [
  { label: "Your Car", icon: Car },
  { label: "Drivers", icon: Users },
  { label: "Address", icon: MapPin },
  { label: "Cover", icon: Shield },
  { label: "Payment", icon: CreditCard },
];

const FULL_WIDTH_STEPS = [0, 1];

export type VehicleData = {
  registration: string;
  make: string;
  model: string;
  year: number;
  engineSize: string;
  fuelType: string;
  bodyType: string;
  value: number;
  mileage: number;
};

export type DriverData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  licenceNumber: string;
  licenceType: string;
  licenceYears: number;
  ncbYears: number;
  occupation: string;
  claimsHistory: number;
  convictions: number;
  isMainDriver: boolean;
};

export type AddressData = {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
};

export type CoverData = {
  coverType: "third-party" | "third-party-fire-theft" | "comprehensive";
  paymentFrequency: "annual" | "monthly";
  annualPremium: number;
  monthlyPremium: number;
};

export type PaymentData = {
  cardLast4: string;
  cardBrand: string;
  billingName: string;
};

export type QuoteState = {
  vehicle: VehicleData | null;
  drivers: DriverData[];
  address: AddressData | null;
  cover: CoverData | null;
  payment: PaymentData | null;
  policyId: string | null;
  policyNumber: string | null;
};

export default function GetQuotePage() {
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(-1);
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<QuoteState>({
    vehicle: null,
    drivers: [],
    address: null,
    cover: null,
    payment: null,
    policyId: null,
    policyNumber: null,
  });

  function updateState(patch: Partial<QuoteState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  function goTo(nextStep: number) {
    setPrevStep(step);
    setAnimating(true);
    setStep(nextStep);
    setTimeout(() => setAnimating(false), 350);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return <StepSuccess state={state} />;
  }

  const isFullWidth = FULL_WIDTH_STEPS.includes(step);

  // Back destination: step > 0 goes back a step, step === 0 goes home
  const backHref = step === 0 ? "/" : undefined;
  const handleBack = step === 0 ? undefined : () => goTo(step - 1);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Quote header — back button + logo + progress bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Back */}
          <div className="w-28 flex items-center">
            {backHref ? (
              <Link
                href={backHref}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors font-medium"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Home</span>
              </Link>
            ) : (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors font-medium"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
          </div>

          {/* Progress bar — centred */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-0">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = i === step;
                const completed = i < step;
                return (
                  <div key={s.label} className="flex items-center">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        active
                          ? "bg-blue-700 text-white shadow-sm"
                          : completed
                          ? "text-green-700 bg-green-50"
                          : "text-gray-400"
                      }`}
                    >
                      {completed ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check size={9} className="text-white" />
                        </div>
                      ) : (
                        <Icon size={13} />
                      )}
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="relative w-6 h-0.5 mx-0.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-green-400 rounded-full transition-all duration-500"
                          style={{ width: i < step ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logo right-aligned to balance */}
          <div className="w-28 flex items-center justify-end">
            <Link href="/" className="text-blue-900 font-bold text-sm hidden sm:block">
              DriveSure
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div
          ref={contentRef}
          className={`transition-all duration-300 h-full ${
            animating
              ? prevStep < step
                ? "opacity-0 translate-x-3"
                : "opacity-0 -translate-x-3"
              : "opacity-100 translate-x-0"
          }`}
        >
          {isFullWidth ? (
            <div className="flex-1">
              {step === 0 && (
                <StepVehicle
                  data={state.vehicle}
                  onNext={(v) => { updateState({ vehicle: v }); goTo(1); }}
                />
              )}
              {step === 1 && (
                <StepDrivers
                  data={state.drivers}
                  session={session}
                  onBack={() => goTo(0)}
                  onNext={(d) => { updateState({ drivers: d }); goTo(2); }}
                />
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto px-4 py-10">
              {step === 2 && (
                <StepAddress
                  data={state.address}
                  onBack={() => goTo(1)}
                  onNext={(a) => { updateState({ address: a }); goTo(3); }}
                />
              )}
              {step === 3 && (
                <StepCover
                  vehicle={state.vehicle!}
                  drivers={state.drivers}
                  data={state.cover}
                  onBack={() => goTo(2)}
                  onNext={(c) => { updateState({ cover: c }); goTo(4); }}
                />
              )}
              {step === 4 && (
                <StepPayment
                  state={state}
                  session={session}
                  onBack={() => goTo(3)}
                  onSuccess={(policyId, policyNumber) => {
                    updateState({ policyId, policyNumber });
                    setDone(true);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
