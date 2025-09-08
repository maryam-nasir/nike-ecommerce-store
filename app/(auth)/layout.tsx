import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <section className="h-full hidden lg:flex flex-col items-start justify-between bg-dark-900 p-10">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-light-100">
          <Image
            src="/logo.svg"
            alt="Nike Logo"
            width={24}
            height={9}
            className="invert"
          />
        </div>
        <div className="text-light-100 space-y-4">
          <h1 className="text-4xl font-bold">Just Do It</h1>
          <p className="max-w-sm">
            Join millions of athletes and fitness enthusiasts who trust Nike for
            their performance needs.
          </p>
        <div className="flex items-center gap-2 mt-8">
          <span className="w-2 h-2 rounded-full bg-light-100 block"></span>
          <span className="w-2 h-2 rounded-full bg-light-100 block"></span>
          <span className="w-2 h-2 rounded-full bg-light-100 block"></span>
        </div>
        </div>
        <div className="text-light-400 text-sm">
          &copy; {new Date().getFullYear()} Nike. All rights reserved.
        </div>
      </section>
      <section className="h-full flex flex-col items-center justify-center p-10">
        {children}
      </section>
    </main>
  );
}
