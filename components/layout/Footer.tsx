import Link from "next/link";
import { Car } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Car size={20} className="text-blue-400" />
              DriveSure
            </div>
            <p className="text-sm text-blue-300 leading-relaxed">
              Authorised and regulated by the Financial Conduct Authority.<br />
              FCA No. 123456
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/get-quote" className="hover:text-white transition-colors">Third Party</Link></li>
              <li><Link href="/get-quote" className="hover:text-white transition-colors">Third Party, Fire & Theft</Link></li>
              <li><Link href="/get-quote" className="hover:text-white transition-colors">Comprehensive</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Claims: <span className="text-white">0800 123 4567</span></li>
              <li>Email: <span className="text-white">hello@drivesure.co.uk</span></li>
              <li>Mon–Fri 8am–8pm</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between text-xs text-blue-400 gap-2">
          <p>© {new Date().getFullYear()} DriveSure Ltd. Registered in England & Wales No. 12345678.</p>
          <p>1 Insurance Square, London, EC1A 1BB</p>
        </div>
      </div>
    </footer>
  );
}
