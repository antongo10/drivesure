"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Car, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-900 text-xl">
          <Car size={24} className="text-blue-600" />
          DriveSure
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#cover" className="text-sm text-gray-600 hover:text-blue-700">Cover Types</Link>
          <Link href="/#how" className="text-sm text-gray-600 hover:text-blue-700">How It Works</Link>
          <Link href="/#features" className="text-sm text-gray-600 hover:text-blue-700">Features</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-blue-700 hover:underline">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-700">
                Sign in
              </Link>
              <Link
                href="/get-quote"
                className="text-sm font-semibold bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Get a Quote
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/get-quote" className="block text-sm font-semibold bg-blue-700 text-white px-4 py-2 rounded-lg text-center">
            Get a Quote
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="block text-sm text-gray-700">Dashboard</Link>
              <button onClick={() => signOut()} className="block text-sm text-gray-500">Sign out</button>
            </>
          ) : (
            <Link href="/login" className="block text-sm text-gray-700">Sign in</Link>
          )}
        </div>
      )}
    </nav>
  );
}
