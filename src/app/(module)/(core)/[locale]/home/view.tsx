"use client";

import Image from "next/image";

const View = () => {
  return (
    <>
      <div className="mt-16">
        {[1, 2, 3, 4, 5].map((idx) => {
          return (
            <section key={idx} className="w-full">
              <Image src="/fakebook-bg.png" alt="zzz" width="640" height="320" className="w-full h-full object-cover" />
            </section>
          )
        })}
      </div>
    </>
  )
}

export default View;
