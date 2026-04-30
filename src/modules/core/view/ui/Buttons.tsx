"use client";

import { cn } from "@/app/lib/utils";

export const DefaultButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className={cn([
      "px-3 py-2 rounded-lg bg-white text-gray-700 border border-gray-700",
      "hover:bg-gray-700 hover:text-gray-50 transition-colors"
    ])}
      type="button">
      {children}
    </button>
  );
};

export const RoundedButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
      {children}
    </button>
  );
};
