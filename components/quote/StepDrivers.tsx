"use client";

import { useState } from "react";
import { DriverData } from "@/app/get-quote/page";
import { Plus, Trash2, ChevronRight, ChevronLeft, User } from "lucide-react";
import { Session } from "next-auth";

const OCCUPATIONS = [
  "Accountant", "Actor", "Administrator", "Architect", "Builder", "Chef", "Civil Servant",
  "Cleaner", "Customer Service", "Designer", "Doctor", "Driver", "Electrician",
  "Engineer", "Farmer", "Finance", "Firefighter", "Healthcare", "HR", "IT Professional",
  "Journalist", "Lawyer", "Manager", "Marketing", "Mechanic", "Nurse", "Other",
  "Pharmacist", "Plumber", "Police Officer", "Retired", "Sales", "Self-Employed",
  "Student", "Teacher", "Technician", "Unemployed",
];

const emptyDriver = (): DriverData => ({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  licenceNumber: "",
  licenceType: "full",
  licenceYears: 1,
  ncbYears: 0,
  occupation: "Other",
  claimsHistory: 0,
  convictions: 0,
  isMainDriver: false,
});

interface Props {
  data: DriverData[];
  session: Session | null;
  onBack: () => void;
  onNext: (d: DriverData[]) => void;
}

export default function StepDrivers({ data, onBack, onNext }: Props) {
  const initial: DriverData[] = data.length > 0 ? data : [{ ...emptyDriver(), isMainDriver: true }];
  const [drivers, setDrivers] = useState<DriverData[]>(initial);
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  function updateDriver(i: number, k: keyof DriverData, v: string | number | boolean) {
    setDrivers((ds) => {
      const updated = [...ds];
      updated[i] = { ...updated[i], [k]: v };
      return updated;
    });
  }

  function addDriver() {
    if (drivers.length >= 5) return;
    const newDrivers = [...drivers, emptyDriver()];
    setDrivers(newDrivers);
    setActive(newDrivers.length - 1);
  }

  function removeDriver(i: number) {
    setDrivers((ds) => {
      const updated = ds.filter((_, idx) => idx !== i);
      if (!updated.some((d) => d.isMainDriver)) {
        updated[0] = { ...updated[0], isMainDriver: true };
      }
      return updated;
    });
    setActive(Math.max(0, i - 1));
  }

  function setMainDriver(i: number) {
    setDrivers((ds) => ds.map((d, idx) => ({ ...d, isMainDriver: idx === i })));
  }

  function validate(): boolean {
    const errs: string[] = [];
    drivers.forEach((d, i) => {
      if (!d.firstName || !d.lastName) errs.push(`Driver ${i + 1}: full name is required`);
      if (!d.dateOfBirth) errs.push(`Driver ${i + 1}: date of birth is required`);
      else {
        const age = new Date().getFullYear() - new Date(d.dateOfBirth).getFullYear();
        if (age < 17) errs.push(`Driver ${i + 1}: must be at least 17`);
      }
      if (!d.licenceNumber) errs.push(`Driver ${i + 1}: licence number is required`);
    });
    if (!drivers.some((d) => d.isMainDriver)) errs.push("Please select a main driver");
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onNext(drivers);
  }

  const years = Array.from({ length: 51 }, (_, i) => i);
  const d = drivers[active];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-128px)]">
      {/* LEFT: Driver tabs + form — full width on mobile, fixed on desktop */}
      <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 bg-white flex flex-col">
        <div className="p-8 flex-1 overflow-y-auto">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((e, i) => <li key={i}>• {e}</li>)}
              </ul>
            </div>
          )}

          {/* Driver tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {drivers.map((dr, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === i
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <User size={13} />
                {dr.firstName || `Driver ${i + 1}`}
                {dr.isMainDriver && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${active === i ? "bg-blue-500" : "bg-blue-100 text-blue-700"}`}>
                    main
                  </span>
                )}
              </button>
            ))}
            {drivers.length < 5 && (
              <button
                type="button"
                onClick={addDriver}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus size={13} />
                Add driver
              </button>
            )}
          </div>

          {/* Form for active driver */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">First name *</label>
                <input
                  required
                  value={d.firstName}
                  onChange={(e) => updateDriver(active, "firstName", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="James"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Last name *</label>
                <input
                  required
                  value={d.lastName}
                  onChange={(e) => updateDriver(active, "lastName", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Date of birth *</label>
                <input
                  type="date"
                  required
                  value={d.dateOfBirth}
                  onChange={(e) => updateDriver(active, "dateOfBirth", e.target.value)}
                  max={new Date(Date.now() - 17 * 365.25 * 24 * 3600 * 1000).toISOString().slice(0, 10)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Occupation *</label>
                <select
                  required
                  value={d.occupation}
                  onChange={(e) => updateDriver(active, "occupation", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                >
                  {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Driving licence number *</label>
              <input
                required
                value={d.licenceNumber}
                onChange={(e) => updateDriver(active, "licenceNumber", e.target.value.toUpperCase())}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors tracking-widest"
                placeholder="SMITH123456JA1AB"
                maxLength={18}
              />
              <p className="text-xs text-gray-400 mt-1.5">Found on the front of your pink driving licence (section 5)</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Licence type</label>
                <select
                  value={d.licenceType}
                  onChange={(e) => updateDriver(active, "licenceType", e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                >
                  <option value="full">Full</option>
                  <option value="provisional">Provisional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Years licensed</label>
                <select
                  value={d.licenceYears}
                  onChange={(e) => updateDriver(active, "licenceYears", parseInt(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                >
                  {years.map((y) => <option key={y} value={y}>{y}yr{y !== 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">NCB years</label>
                <select
                  value={d.ncbYears}
                  onChange={(e) => updateDriver(active, "ncbYears", parseInt(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                >
                  {[0,1,2,3,4,5,6,7,8,9].map((y) => <option key={y} value={y}>{y}yr{y !== 1 ? "s" : ""}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Claims (5 yrs)</label>
                <select
                  value={d.claimsHistory}
                  onChange={(e) => updateDriver(active, "claimsHistory", parseInt(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                >
                  {[0,1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Convictions</label>
                <select
                  value={d.convictions}
                  onChange={(e) => updateDriver(active, "convictions", parseInt(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                >
                  {[0,1,2,3].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {/* Main driver + remove */}
            <div className="flex items-center justify-between pt-1">
              {!d.isMainDriver ? (
                <button
                  type="button"
                  onClick={() => setMainDriver(active)}
                  className="text-sm text-blue-700 border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Set as main driver
                </button>
              ) : (
                <span className="text-sm text-green-700 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Main driver
                </span>
              )}
              {drivers.length > 1 && !d.isMainDriver && (
                <button
                  type="button"
                  onClick={() => removeDriver(active)}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-medium px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all"
              >
                Continue to Address
                <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT: Driving licence preview — hidden on mobile */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <UKLicenceCard driver={d} index={active} total={drivers.length} />

          {/* Info callouts */}
          <div className="mt-6 space-y-2">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-slate-400 text-xs leading-relaxed">
                <span className="text-white font-medium">Licence number</span> — found on the front of your pink photocard licence, section&nbsp;5. It&apos;s 16 characters long.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-slate-400 text-xs leading-relaxed">
                <span className="text-white font-medium">No claims bonus</span> — each claim-free year earns a 10% discount, up to 60% after 5+ years.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UKLicenceCard({ driver, index, total }: { driver: DriverData; index: number; total: number }) {
  const fullName = [driver.firstName, driver.lastName].filter(Boolean).join(" ") || "FULL NAME";
  const dob = driver.dateOfBirth
    ? new Date(driver.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "DD/MM/YYYY";
  const licNum = driver.licenceNumber || "XXXXX000000XX0XX";

  // Generate a licence issue/expiry
  const issueYear = driver.licenceYears ? new Date().getFullYear() - driver.licenceYears : new Date().getFullYear();
  const expiryYear = issueYear + 10;

  return (
    <div className="relative" style={{ perspective: "800px" }}>
      {/* DVLA Pink Photocard */}
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #e8c4d8 0%, #f0d4e8 30%, #e0b8d0 60%, #d4a8c4 100%)",
          border: "2px solid rgba(255,255,255,0.3)",
          aspectRatio: "85.6/54",
          position: "relative",
        }}
      >
        {/* Holographic overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)",
          }}
        />

        {/* Header bar */}
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{ background: "rgba(0,48,135,0.85)" }}
        >
          <div className="flex items-center gap-2">
            {/* EU stars */}
            <div className="flex flex-col items-center w-5">
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-yellow-400 opacity-80" />
                ))}
              </div>
              <span className="text-yellow-300 font-black text-xs mt-0.5">GB</span>
            </div>
            <span className="text-white font-bold text-xs tracking-widest">DRIVING LICENCE</span>
          </div>
          <span className="text-blue-200 text-xs font-medium">DVLA</span>
        </div>

        <div className="p-3 flex gap-3 h-full">
          {/* Photo placeholder */}
          <div
            className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              width: "60px",
              height: "80px",
              background: "linear-gradient(135deg, #b0a0c0, #d0b8d8)",
              border: "2px solid rgba(255,255,255,0.5)",
            }}
          >
            <User size={28} className="text-white/50" />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-1">
            {/* 1. Surname */}
            <LicenceField num="1." value={driver.lastName.toUpperCase() || "SURNAME"} large />
            {/* 2. First name */}
            <LicenceField num="2." value={driver.firstName.toUpperCase() || "FIRST NAME"} />
            {/* 3. DOB */}
            <LicenceField num="3." value={dob} label="Date of birth" />
            {/* 4a. Issue */}
            <div className="flex gap-3">
              <LicenceField num="4a." value={`01/01/${issueYear}`} label="Issue" small />
              <LicenceField num="4b." value={`01/01/${expiryYear}`} label="Expiry" small />
            </div>
            {/* 5. Licence number */}
            <LicenceField
              num="5."
              value={licNum.padEnd(16, "·").slice(0, 16).toUpperCase()}
              mono
            />
            {/* 7. Address stub */}
            <LicenceField num="8." value={`UNITED KINGDOM`} small muted />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 flex justify-between items-center">
          <span
            className="text-xs font-bold tracking-widest"
            style={{ color: "rgba(0,48,135,0.6)" }}
          >
            {driver.licenceType === "provisional" ? "PROVISIONAL" : "FULL LICENCE"}
          </span>
          <span className="text-xs text-purple-800/50 font-medium">
            Driver {index + 1}/{total}
            {driver.isMainDriver ? " · MAIN" : ""}
          </span>
        </div>
      </div>

      {/* NCB badge */}
      {driver.ncbYears > 0 && (
        <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-green-500 border-4 border-white shadow-lg flex flex-col items-center justify-center">
          <span className="text-white font-black text-sm leading-none">{driver.ncbYears}</span>
          <span className="text-green-100 text-xs leading-none">NCB</span>
        </div>
      )}
    </div>
  );
}

function LicenceField({
  num, value, label, large, small, mono, muted,
}: {
  num: string;
  value: string;
  label?: string;
  large?: boolean;
  small?: boolean;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-purple-800/50 font-bold shrink-0" style={{ fontSize: "8px" }}>{num}</span>
      <span
        className={`font-bold leading-tight truncate ${
          large ? "text-sm" : small ? "text-xs" : "text-xs"
        } ${mono ? "font-mono tracking-wider" : ""} ${muted ? "opacity-50" : ""}`}
        style={{ color: muted ? "#555" : "#1a1a3e" }}
      >
        {value}
      </span>
    </div>
  );
}
