"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";

export default function Navbar() {
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-black/10 dark:border-white/10 bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Logo" width={36} height={18} className="invert" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-black dark:text-white">
              <Link href="/products?gender=men" className="hover:opacity-70 transition-opacity">Men</Link>
              <Link href="/products?gender=women" className="hover:opacity-70 transition-opacity">Women</Link>
              <Link href="#" className="hover:opacity-70 transition-opacity">Kids</Link>
              <Link href="/products" className="hover:opacity-70 transition-opacity">Collections</Link>
              <Link href="#" className="hover:opacity-70 transition-opacity">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center gap-6 text-sm text-black dark:text-white">
            <button className="hover:opacity-70 transition-opacity">Search</button>
            <Link href="#" className="hover:opacity-70 transition-opacity">My Cart ({itemCount})</Link>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <HiMenu className="w-6 h-6 text-black dark:text-white" aria-hidden="true" />
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-4 text-sm text-black dark:text-white">
              <Link href="/products?gender=men" onClick={() => setOpen(false)}>Men</Link>
              <Link href="/products?gender=women" onClick={() => setOpen(false)}>Women</Link>
              <Link href="#" onClick={() => setOpen(false)}>Kids</Link>
              <Link href="/products" onClick={() => setOpen(false)}>Collections</Link>
              <Link href="#" onClick={() => setOpen(false)}>Contact</Link>
              <div className="pt-2 flex items-center justify-between">
                <button className="hover:opacity-70 transition-opacity">Search</button>
                <Link href="#" className="hover:opacity-70 transition-opacity">My Cart ({itemCount})</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
