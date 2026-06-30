"use client";

import Link from "next/link";
import { QuoteState } from "@/app/get-quote/page";
import { CheckCircle, Download, LayoutDashboard, Mail } from "lucide-react";
import { generateCertificatePDF } from "@/lib/certificate";

interface Props {
  state: QuoteState;
}

export default function StepSuccess({ state }: Props) {
  const { vehicle, drivers, address, cover, policyNumber } = state;

  async function downloadCertificate() {
    if (!policyNumber || !vehicle || !drivers.length || !address) return;
    const mainDriver = drivers.find((d) => d.isMainDriver) || drivers[0];
    const blob = await generateCertificatePDF({
      policyNumber,
      holderName: `${mainDriver.firstName} ${mainDriver.lastName}`,
      vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      registration: vehicle.registration,
      coverType: cover?.coverType || "",
      startDate: new Date().toLocaleDateString("en-GB"),
      endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toLocaleDateString("en-GB"),
      drivers: drivers.map((d) => `${d.firstName} ${d.lastName}${d.isMainDriver ? " (Main)" : ""}`),
      address: [address.line1, address.line2, address.city, address.postcode].filter(Boolean).join(", "),
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DriveSure-${policyNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={48} className="text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-blue-950 mb-2">You&apos;re Covered!</h1>
          <p className="text-gray-500 mb-6">
            Your car insurance is now active. A confirmation has been sent to your email.
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Policy number</span>
                <span className="font-bold text-blue-900 font-mono">{policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-medium">{vehicle?.year} {vehicle?.make} {vehicle?.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cover type</span>
                <span className="font-medium capitalize">{cover?.coverType?.replace(/-/g, " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Drivers</span>
                <span className="font-medium">{drivers.length} driver{drivers.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Start date</span>
                <span className="font-medium">{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Premium</span>
                <span className="font-bold text-blue-700">
                  £{(cover?.paymentFrequency === "annual" ? cover.annualPremium : cover?.monthlyPremium || 0).toFixed(2)} per {cover?.paymentFrequency === "annual" ? "year" : "month"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={downloadCertificate}
              className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition-colors"
            >
              <Download size={18} />
              Download Certificate (PDF)
            </button>
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Mail size={14} />
            Confirmation email sent to your inbox
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Claims line: <strong className="text-gray-600">0800 123 4567</strong> (24/7)
          </p>
        </div>
      </div>
    </div>
  );
}
