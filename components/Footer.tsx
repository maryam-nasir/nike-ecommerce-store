import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <HiOutlineLocationMarker className="w-4 h-4" aria-hidden="true" />
            <span className="tracking-tight">Pakistan</span>
            <span className="mx-2">&copy; {year} Nike, Inc. All Rights Reserved</span>
          </div>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-white/80">
            <Link href="#" className="hover:text-white transition-colors">Guides</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Sale</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="#" className="hover:text-white transition-colors">Nike Privacy Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
