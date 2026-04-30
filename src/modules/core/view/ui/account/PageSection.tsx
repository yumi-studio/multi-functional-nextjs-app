"use client";

import { cn } from "@/app/lib/utils";

const PageSection = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="w-full h-auto mb-3">
      {/* Section Header */}
      <div className={cn([
        "block px-3 py-2 bg-white text-center text-gray-900 font-semibold rounded-t-lg mb-px",
        "lg:inline-block"
      ])}>
        {title}
      </div>

      {/* Section Content */}
      <div className={cn([
        "w-full h-auto bg-white rounded-lg rounded-t-none p-3",
        "lg:rounded-tr-lg"
      ])}>
        <div className="w-full h-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageSection;
