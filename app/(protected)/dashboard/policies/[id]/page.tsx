"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Car, Shield, Users, MapPin, CreditCard, Download, ArrowLeft, CheckCircle, Clock, XCircle
} from "lucide-react";
import { generateCertificatePDF } from "@/lib/certificate";

interface PolicyDetail {
  id: string;
  policyNumber: string;
  status: string;
  startDate: string;
  endDate: string;
  coverType: string;
  annualPremium: number;
  monthlyPremium: number;
  paymentFrequency: string;
  createdAt: string;
  vehicle: {
    registration: string; make: string; model: string; year: number;
    engineSize: string; fuelType: string; bodyType: string; value: number; mileage: number;
  } | null;
  drivers: Array<{
    firstName: string; lastName: string; dateOfBirth: string; licenceNumber: string;
    licenceType: string; licenceYears: number; ncbYears: number; occupation: string;
    claimsHistory: number; convictions: number; isMainDriver: boolean;
  }>;
  address: { line1: string; line2?: string | null; city: string; county?: string | null; postcode: string } | null;
  payment: { cardLast4: string; cardBrand: string; billingName: string; amount: number; paidAt: string; transactionId: string } | null;
}

const COVER_LABELS: Record<string, string> = {
  "third-party": "Third Party Only",
  "third-party-fire-theft": "Third Party, Fire & Theft",
  comprehensive: "Comprehensive",
};

export default function PolicyDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [policy, setPolicy] = useState<PolicyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/policies/${id}`)
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { setPolicy(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, id]);

  async function downloadCert() {
    if (!policy?.vehicle || !policy.drivers.length) return;
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
        ? [policy.address.line1, policy.address.line2, policy.address.city, policy.address.postcode].filter(Boolean).join(", ")
        : "",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DriveSure-${policy.policyNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div>
            <h2 className="text-xl font-bold text-blue-950 mb-2">Policy not found</h2>
            <Link href="/dashboard" className="text-blue-700 hover:underline">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    active: { label: "Active", icon: <CheckCircle size={16} />, classes: "bg-green-100 text-green-700" },
    expired: { label: "Expired", icon: <Clock size={16} />, classes: "bg-gray-100 text-gray-600" },
    cancelled: { label: "Cancelled", icon: <XCircle size={16} />, classes: "bg-red-100 text-red-600" },
  }[policy.status] || { label: policy.status, icon: null, classes: "bg-gray-100 text-gray-600" };

  const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">{icon}</div>
        <h3 className="font-semibold text-blue-950">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-700 text-sm font-medium hover:underline mb-6">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-blue-950 text-white rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${statusConfig.classes}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1">
                {policy.vehicle
                  ? `${policy.vehicle.year} ${policy.vehicle.make} ${policy.vehicle.model}`
                  : "Motor Insurance Policy"}
              </h2>
              <p className="text-blue-300 font-mono text-sm">{policy.policyNumber}</p>
            </div>
            <button
              onClick={downloadCert}
              className="flex items-center gap-2 bg-white text-blue-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              <Download size={16} />
              Download Certificate
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Policy */}
          <Section icon={<Shield size={16} />} title="Policy Details">
            <Row label="Cover type" value={COVER_LABELS[policy.coverType] || policy.coverType} />
            <Row label="Start date" value={new Date(policy.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
            <Row label="End date" value={new Date(policy.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
            <Row label="Annual premium" value={`£${policy.annualPremium.toFixed(2)}`} />
            <Row label="Monthly premium" value={`£${policy.monthlyPremium.toFixed(2)}`} />
            <Row label="Payment" value={policy.paymentFrequency === "annual" ? "Paid annually" : "Monthly instalments"} />
          </Section>

          {/* Vehicle */}
          {policy.vehicle && (
            <Section icon={<Car size={16} />} title="Vehicle">
              <Row label="Registration" value={<span className="font-mono">{policy.vehicle.registration.toUpperCase()}</span>} />
              <Row label="Make & model" value={`${policy.vehicle.make} ${policy.vehicle.model}`} />
              <Row label="Year" value={policy.vehicle.year.toString()} />
              <Row label="Engine" value={policy.vehicle.engineSize} />
              <Row label="Fuel" value={policy.vehicle.fuelType} />
              <Row label="Body type" value={policy.vehicle.bodyType} />
              <Row label="Estimated value" value={`£${policy.vehicle.value.toLocaleString()}`} />
              <Row label="Annual mileage" value={`${policy.vehicle.mileage.toLocaleString()} miles`} />
            </Section>
          )}

          {/* Drivers */}
          <Section icon={<Users size={16} />} title={`Drivers (${policy.drivers.length})`}>
            {policy.drivers.map((d, i) => (
              <div key={i} className={`${i > 0 ? "border-t border-gray-100 pt-4 mt-4" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-950">{d.firstName} {d.lastName}</span>
                  {d.isMainDriver && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Main driver</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-4 text-sm">
                  <span className="text-gray-500">DOB</span>
                  <span className="text-gray-900">{new Date(d.dateOfBirth).toLocaleDateString("en-GB")}</span>
                  <span className="text-gray-500">Licence</span>
                  <span className="text-gray-900 capitalize">{d.licenceType}</span>
                  <span className="text-gray-500">NCB</span>
                  <span className="text-gray-900">{d.ncbYears} year{d.ncbYears !== 1 ? "s" : ""}</span>
                  <span className="text-gray-500">Occupation</span>
                  <span className="text-gray-900">{d.occupation}</span>
                </div>
              </div>
            ))}
          </Section>

          {/* Address */}
          {policy.address && (
            <Section icon={<MapPin size={16} />} title="Address">
              <Row label="Line 1" value={policy.address.line1} />
              {policy.address.line2 && <Row label="Line 2" value={policy.address.line2} />}
              <Row label="City" value={policy.address.city} />
              {policy.address.county && <Row label="County" value={policy.address.county} />}
              <Row label="Postcode" value={<span className="font-mono">{policy.address.postcode}</span>} />
            </Section>
          )}

          {/* Payment */}
          {policy.payment && (
            <Section icon={<CreditCard size={16} />} title="Payment">
              <Row label="Cardholder" value={policy.payment.billingName} />
              <Row label="Card" value={`${policy.payment.cardBrand} ending ••••${policy.payment.cardLast4}`} />
              <Row label="Amount paid" value={`£${policy.payment.amount.toFixed(2)}`} />
              <Row label="Date" value={new Date(policy.payment.paidAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
              <Row label="Transaction ID" value={<span className="font-mono text-xs">{policy.payment.transactionId}</span>} />
            </Section>
          )}
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
          <strong>Need to make a claim?</strong> Call our 24/7 claims line: <strong>0800 123 4567</strong>
        </div>
      </div>

      <Footer />
    </div>
  );
}
