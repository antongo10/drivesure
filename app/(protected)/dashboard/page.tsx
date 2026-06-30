"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Car, Shield, Plus, ChevronRight, Clock, CheckCircle, XCircle,
  Download, Users, MapPin
} from "lucide-react";
import { generateCertificatePDF } from "@/lib/certificate";

interface Policy {
  id: string;
  policyNumber: string;
  status: string;
  startDate: string;
  endDate: string;
  coverType: string;
  annualPremium: number;
  monthlyPremium: number;
  paymentFrequency: string;
  vehicle: { registration: string; make: string; model: string; year: number } | null;
  drivers: Array<{ firstName: string; lastName: string; isMainDriver: boolean }>;
  address: { line1: string; city: string; postcode: string } | null;
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; classes: string }> = {
  active: { label: "Active", icon: <CheckCircle size={14} />, classes: "bg-green-100 text-green-700" },
  expired: { label: "Expired", icon: <Clock size={14} />, classes: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelled", icon: <XCircle size={14} />, classes: "bg-red-100 text-red-600" },
};

const COVER_LABELS: Record<string, string> = {
  "third-party": "Third Party",
  "third-party-fire-theft": "TP, Fire & Theft",
  comprehensive: "Comprehensive",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/policies")
        .then((r) => r.json())
        .then((d) => { setPolicies(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status]);

  async function downloadCert(policy: Policy) {
    if (!policy.vehicle || !policy.drivers.length) return;
    const mainDriver = policy.drivers.find((d) => d.isMainDriver) || policy.drivers[0];
    const blob = await generateCertificatePDF({
      policyNumber: policy.policyNumber,
      holderName: `${mainDriver.firstName} ${mainDriver.lastName}`,
      vehicle: `${policy.vehicle.year} ${policy.vehicle.make} ${policy.vehicle.model}`,
      registration: policy.vehicle.registration,
      coverType: policy.coverType,
      startDate: new Date(policy.startDate).toLocaleDateString("en-GB"),
      endDate: new Date(policy.endDate).toLocaleDateString("en-GB"),
      drivers: policy.drivers.map((d) => `${d.firstName} ${d.lastName}${d.isMainDriver ? " (Main)" : ""}`),
      address: policy.address
        ? [policy.address.line1, policy.address.city, policy.address.postcode].join(", ")
        : "",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DriveSure-${policy.policyNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const activePolicies = policies.filter((p) => p.status === "active");
  const premium = activePolicies.reduce((sum, p) => {
    return sum + (p.paymentFrequency === "annual" ? p.annualPremium : p.monthlyPremium * 12);
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-blue-950 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="text-blue-300 text-sm">{session?.user?.email}</p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Active Policies", value: activePolicies.length.toString() },
              { label: "Annual Premium", value: `£${premium.toFixed(0)}` },
              { label: "Insured Vehicles", value: policies.filter((p) => p.status === "active" && p.vehicle).length.toString() },
            ].map((s) => (
              <div key={s.label} className="bg-blue-900/50 rounded-xl p-4">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-blue-300 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        {/* CTA */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-blue-950">My Policies</h2>
          <Link
            href="/get-quote"
            className="flex items-center gap-2 bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={16} />
            New Policy
          </Link>
        </div>

        {policies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Car size={32} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-blue-950 mb-2">No policies yet</h3>
            <p className="text-gray-500 text-sm mb-6">Get an instant quote and start your cover today.</p>
            <Link
              href="/get-quote"
              className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors"
            >
              <Plus size={18} />
              Get a Quote
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((policy) => {
              const sc = STATUS_CONFIG[policy.status] || STATUS_CONFIG.active;
              return (
                <div key={policy.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                          <Car size={22} className="text-blue-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-blue-950">
                              {policy.vehicle
                                ? `${policy.vehicle.year} ${policy.vehicle.make} ${policy.vehicle.model}`
                                : "Vehicle"}
                            </h3>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${sc.classes}`}>
                              {sc.icon}
                              {sc.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 font-mono mb-3">{policy.policyNumber}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <Shield size={14} className="text-blue-500" />
                              {COVER_LABELS[policy.coverType] || policy.coverType}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users size={14} className="text-blue-500" />
                              {policy.drivers.length} driver{policy.drivers.length !== 1 ? "s" : ""}
                            </span>
                            {policy.address && (
                              <span className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-blue-500" />
                                {policy.address.postcode}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} className="text-blue-500" />
                              {new Date(policy.startDate).toLocaleDateString("en-GB")} – {new Date(policy.endDate).toLocaleDateString("en-GB")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-900">
                          £{(policy.paymentFrequency === "annual" ? policy.annualPremium : policy.monthlyPremium).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">per {policy.paymentFrequency === "annual" ? "year" : "month"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 px-6 py-3 bg-gray-50/50 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex flex-wrap gap-2">
                      {policy.vehicle && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {policy.vehicle.registration.toUpperCase()}
                        </span>
                      )}
                      {policy.drivers.filter((d) => d.isMainDriver).map((d) => (
                        <span key={d.firstName} className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {d.firstName} {d.lastName} (main)
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadCert(policy)}
                        className="flex items-center gap-1.5 text-xs text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                      >
                        <Download size={13} />
                        Certificate
                      </button>
                      <Link
                        href={`/dashboard/policies/${policy.id}`}
                        className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                      >
                        View details
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
