"use client";

import { useState } from "react";
import { LuChevronDown as ChevronDown } from "react-icons/lu";

type Props = {
  title: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
};

export default function CollapsibleSection({ title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <section className="py-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-body-medium text-dark-900">{title}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </section>
  );
}


