import Link from "next/link";
import { Shield, Zap, Award, Clock, ChevronRight, Check, Car, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-700/50 text-blue-200 text-sm px-4 py-2 rounded-full mb-6">
              <Shield size={14} />
              <span>FCA Authorised & Regulated · No. 123456</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Car Insurance<br />
              <span className="text-blue-300">Done Right</span>
            </h1>
            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Get a personalised quote in under 2 minutes. Competitive UK car insurance with instant cover from today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/get-quote"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg"
              >
                Get Your Quote
                <ChevronRight size={20} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
              >
                Manage My Policy
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 hidden lg:block">
          <Car size={400} strokeWidth={0.5} />
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "250,000+", label: "Policies issued" },
              { value: "4.8★", label: "Trustpilot rating" },
              { value: "24/7", label: "Claims support" },
              { value: "FCA", label: "Regulated insurer" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-blue-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cover types */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-950 mb-4">Choose Your Cover</h2>
          <p className="text-center text-gray-500 mb-12">All policies include free 24/7 breakdown cover in the UK</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Third Party",
                desc: "The minimum legal requirement. Covers damage you cause to others.",
                features: ["Third party liability", "Legal expenses cover", "EU driving cover"],
                badge: null,
              },
              {
                name: "Third Party, Fire & Theft",
                desc: "Third party cover plus protection if your car is stolen or damaged by fire.",
                features: ["Everything in Third Party", "Fire damage", "Theft & attempted theft"],
                badge: "Popular",
              },
              {
                name: "Comprehensive",
                desc: "Our most complete cover. Protects you, your car, and third parties.",
                features: ["Everything in TPFT", "Accidental damage", "Windscreen cover", "Courtesy car"],
                badge: "Best Value",
              },
            ].map((cover) => (
              <div key={cover.name} className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 ${cover.badge ? "border-blue-500" : "border-gray-100"}`}>
                {cover.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {cover.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-blue-950 mb-3">{cover.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{cover.desc}</p>
                <ul className="space-y-2">
                  {cover.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={16} className="text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-950 mb-12">Get Covered in 4 Steps</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", icon: <Car size={28} />, title: "Your Car", desc: "Enter your reg plate and we'll find your car details automatically." },
              { step: "02", icon: <Shield size={28} />, title: "Your Details", desc: "Tell us about you and any additional drivers on your policy." },
              { step: "03", icon: <Zap size={28} />, title: "Get Your Quote", desc: "See your personalised price instantly with multiple cover options." },
              { step: "04", icon: <Award size={28} />, title: "Start Driving", desc: "Pay securely and receive your certificate by email immediately." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 mb-4">
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-blue-400 mb-1">{s.step}</div>
                <h3 className="font-bold text-blue-950 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-blue-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DriveSure?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Clock size={24} />, title: "Instant Cover", desc: "Start your cover from today. Certificate issued the moment you pay." },
              { icon: <Phone size={24} />, title: "24/7 Claims Line", desc: "Call us any time on 0800 123 4567. We're here when you need us most." },
              { icon: <Shield size={24} />, title: "FCA Regulated", desc: "Fully authorised and regulated by the Financial Conduct Authority." },
              { icon: <Zap size={24} />, title: "Instant Quote", desc: "No waiting. Get your price in under 2 minutes with no hidden fees." },
              { icon: <Award size={24} />, title: "Multi-Driver Policies", desc: "Add up to 5 named drivers on a single policy at no extra hassle." },
              { icon: <Car size={24} />, title: "UK-Wide Cover", desc: "Drive with confidence anywhere in the UK and across the EU." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-800 flex items-center justify-center text-blue-300">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-blue-300 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-blue-950 mb-4">Ready to get covered?</h2>
          <p className="text-gray-500 mb-8">Join over 250,000 drivers who trust DriveSure for their car insurance.</p>
          <Link
            href="/get-quote"
            className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl hover:bg-blue-800 transition-colors text-lg"
          >
            Get My Free Quote
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
