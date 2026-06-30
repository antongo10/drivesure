"use client";

import { useState, useEffect } from "react";
import { VehicleData } from "@/app/get-quote/page";
import { ChevronRight, Fuel, Settings, Gauge } from "lucide-react";
import CarSilhouette from "./CarSilhouette";
import UKNumberPlate from "./UKNumberPlate";

const MAKES = ["Audi", "BMW", "Citroën", "Ford", "Honda", "Hyundai", "Kia", "Land Rover", "Mazda", "Mercedes-Benz", "Mini", "Nissan", "Peugeot", "Renault", "Seat", "Skoda", "Toyota", "Vauxhall", "Volkswagen", "Volvo"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];
const BODY_TYPES = ["Saloon", "Hatchback", "Estate", "SUV", "Coupe", "Convertible", "MPV", "Van"];
const ENGINE_SIZES = ["999cc", "1000cc", "1200cc", "1400cc", "1600cc", "1800cc", "2000cc", "2200cc", "2500cc", "3000cc", "4000cc+"];

interface Props {
  data: VehicleData | null;
  onNext: (v: VehicleData) => void;
}

const FIELD_GROUPS = [
  {
    id: "registration",
    label: "Registration plate",
    hint: "Enter your reg exactly as it appears on your car",
  },
  {
    id: "details",
    label: "Vehicle details",
  },
  {
    id: "specs",
    label: "Specifications",
  },
  {
    id: "value",
    label: "Value & usage",
  },
];

export default function StepVehicle({ data, onNext }: Props) {
  const [form, setForm] = useState<VehicleData>(
    data || {
      registration: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      engineSize: "1600cc",
      fuelType: "Petrol",
      bodyType: "Hatchback",
      value: 10000,
      mileage: 10000,
    }
  );
  const [activeSection, setActiveSection] = useState(0);
  const [carVisible, setCarVisible] = useState(true);

  const years = Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i);

  function set(k: keyof VehicleData, v: string | number) {
    // Animate car out/in on make or body type change
    if (k === "make" || k === "bodyType" || k === "fuelType") {
      setCarVisible(false);
      setTimeout(() => {
        setForm((f) => ({ ...f, [k]: v }));
        setCarVisible(true);
      }, 250);
    } else {
      setForm((f) => ({ ...f, [k]: v }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext(form);
  }

  const displayMake = form.make || "Your Car";
  const displayModel = form.model || "";

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-128px)]">
      {/* LEFT: Form panel — full width on mobile, fixed on desktop */}
      <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 bg-white flex flex-col">
        <div className="p-8 flex-1 overflow-y-auto">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Registration */}
            <div
              className={`transition-all duration-200 ${activeSection === 0 ? "" : "opacity-70"}`}
              onFocus={() => setActiveSection(0)}
            >
              <SectionLabel step={1} label="Registration Plate" active={activeSection === 0} />
              <div className="mt-3">
                <input
                  required
                  value={form.registration}
                  onChange={(e) => set("registration", e.target.value.toUpperCase())}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 text-lg font-mono uppercase focus:outline-none focus:border-blue-500 tracking-widest transition-colors"
                  placeholder="AB12 CDE"
                  maxLength={8}
                />
                <p className="text-xs text-gray-400 mt-2">As shown on your V5C logbook</p>
              </div>
            </div>

            {/* Make / Model / Year */}
            <div
              className={`transition-all duration-200 ${activeSection === 1 ? "" : "opacity-70"}`}
              onFocus={() => setActiveSection(1)}
            >
              <SectionLabel step={2} label="Make, Model & Year" active={activeSection === 1} />
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Make</label>
                    <select
                      required
                      value={form.make}
                      onChange={(e) => set("make", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                    >
                      <option value="">Select make</option>
                      {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Model</label>
                    <input
                      required
                      value={form.model}
                      onChange={(e) => set("model", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. Golf"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Year</label>
                    <select
                      required
                      value={form.year}
                      onChange={(e) => set("year", parseInt(e.target.value))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                    >
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Body Type</label>
                    <select
                      required
                      value={form.bodyType}
                      onChange={(e) => set("bodyType", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                    >
                      {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div
              className={`transition-all duration-200 ${activeSection === 2 ? "" : "opacity-70"}`}
              onFocus={() => setActiveSection(2)}
            >
              <SectionLabel step={3} label="Engine & Fuel" active={activeSection === 2} />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                    <Settings size={11} />Engine Size
                  </label>
                  <select
                    required
                    value={form.engineSize}
                    onChange={(e) => set("engineSize", e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                  >
                    {ENGINE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                    <Fuel size={11} />Fuel Type
                  </label>
                  <select
                    required
                    value={form.fuelType}
                    onChange={(e) => set("fuelType", e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                  >
                    {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Value & Mileage */}
            <div
              className={`transition-all duration-200 ${activeSection === 3 ? "" : "opacity-70"}`}
              onFocus={() => setActiveSection(3)}
            >
              <SectionLabel step={4} label="Value & Mileage" active={activeSection === 3} />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Est. Value (£)</label>
                  <input
                    type="number"
                    required
                    min={500}
                    max={500000}
                    value={form.value}
                    onChange={(e) => set("value", parseInt(e.target.value))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                    <Gauge size={11} />Annual Mileage
                  </label>
                  <select
                    required
                    value={form.mileage}
                    onChange={(e) => set("mileage", parseInt(e.target.value))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors"
                  >
                    {[3000, 5000, 8000, 10000, 12000, 15000, 20000, 25000, 30000].map((m) => (
                      <option key={m} value={m}>{m.toLocaleString()} miles</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold py-4 rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all text-base"
            >
              Continue to Drivers
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Garage display — hidden on mobile */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex-col items-center justify-center overflow-hidden">
        {/* Garage floor */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: "linear-gradient(to bottom, #1e293b, #0f172a)",
            borderTop: "2px solid #334155",
          }}
        />
        {/* Ceiling lights */}
        <div className="absolute top-0 left-0 right-0 flex justify-around px-12 pt-0">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-20 h-2 bg-slate-600 rounded-b-sm" />
              <div
                className="w-16 h-1.5 rounded-full mt-0.5"
                style={{ background: "#fffbeb", boxShadow: "0 0 20px 8px rgba(255,250,200,0.15)" }}
              />
            </div>
          ))}
        </div>
        {/* Floor lines */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col gap-2 opacity-20">
          <div className="h-px bg-yellow-400 mx-8" />
          <div className="h-px bg-white mx-8" />
        </div>

        {/* Car display area */}
        <div className="relative z-10 w-full px-8 flex flex-col items-center gap-6">
          {/* Number plate */}
          <div
            className="transition-all duration-300"
            style={{
              opacity: form.registration ? 1 : 0.5,
              transform: form.registration ? "translateY(0)" : "translateY(4px)",
            }}
          >
            <UKNumberPlate value={form.registration} />
          </div>

          {/* Car silhouette */}
          <div
            className="w-full max-w-lg transition-all duration-300"
            style={{
              opacity: carVisible ? 1 : 0,
              transform: carVisible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.97)",
            }}
          >
            <CarSilhouette
              make={form.make}
              bodyType={form.bodyType}
              fuelType={form.fuelType}
            />
          </div>

          {/* Car label */}
          <div className="text-center">
            <p className="text-white font-bold text-xl tracking-wide">
              {displayMake} {displayModel}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {form.year} · {form.bodyType} · {form.fuelType}
            </p>
            {form.fuelType === "Electric" && (
              <span className="inline-block mt-2 bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
                ⚡ EV – 10% discount applied
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({
  step,
  label,
  active,
}: {
  step: number;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        {step}
      </div>
      <span
        className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
          active ? "text-blue-700" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
