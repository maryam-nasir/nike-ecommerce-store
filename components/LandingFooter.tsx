import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const columns = [
  {
    title: "Featured",
    links: ["Air Force 1", "Huarache", "Air Max 90", "Air Max 95"],
  },
  {
    title: "Shoes",
    links: ["All Shoes", "Custom Shoes", "Jordan Shoes", "Running Shoes"],
  },
  {
    title: "Clothing",
    links: [
      "All Clothing",
      "Modest Wear",
      "Hoodies & Pullovers",
      "Shirts & Tops",
    ],
  },
  {
    title: "Kids'",
    links: [
      "Infant & Toddler Shoes",
      "Kids' Shoes",
      "Kids' Jordan Shoes",
      "Kids' Basketball Shoes",
    ],
  },
];

function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/5 transition-colors"
    >
      {children}
    </button>
  );
}

export default function LandingFooter() {
  return (
    <section className="w-full bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-2 flex items-start">
            <Image src="/logo.svg" alt="Nike" width={64} height={24} className="mt-1" />
          </div>

          <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title} className="space-y-3">
                <h3 className="text-white font-semibold text-base">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((text) => (
                    <li key={text}>
                      <Link href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="md:col-span-1 flex flex-wrap md:justify-end items-start gap-3">
            <SocialIcon label="X">
              <span className="text-lg">
                <FaXTwitter />
              </span>
            </SocialIcon>
            <SocialIcon label="Facebook">
              <span className="text-lg">
                <FaFacebookF />
              </span>
            </SocialIcon>
            <SocialIcon label="Instagram">
              <span className="text-lg">
                <FaInstagram />
              </span>
            </SocialIcon>
          </div>
        </div>
      </div>
    </section>
  );
}
