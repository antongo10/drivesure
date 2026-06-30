"use client";

import { useState } from "react";
import { AddressData } from "@/app/get-quote/page";
import { MapPin, ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  data: AddressData | null;
  onBack: () => void;
  onNext: (a: AddressData) => void;
}

export default function StepAddress({ data, onBack, onNext }: Props) {
  const [form, setForm] = useState<AddressData>(
    data || { line1: "", line2: "", city: "", county: "", postcode: "" }
  );

  function set(k: keyof AddressData, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext(form);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <MapPin size={24} className="text-blue-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-950">Your Address</h2>
          <p className="text-gray-500 text-sm">Where is the vehicle kept overnight?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Address line 1 <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.line1}
            onChange={(e) => set("line1", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="12 High Street"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Address line 2 <span className="text-gray-400">(optional)</span>
          </label>
          <input
            value={form.line2}
            onChange={(e) => set("line2", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Flat 4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Town / City <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="London"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              County <span className="text-gray-400">(optional)</span>
            </label>
            <input
              value={form.county}
              onChange={(e) => set("county", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Greater London"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Postcode <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.postcode}
            onChange={(e) => set("postcode", e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
            placeholder="SW1A 1AA"
            maxLength={8}
          />
        </div>

        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
          <strong>Why do we need this?</strong> The postcode where your vehicle is kept overnight affects your premium, as some areas carry higher risk of theft or accidents.
        </div>

        <div className="flex gap-3 pt-2">
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
            className="flex-1 flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition-colors"
          >
            See My Quote
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
