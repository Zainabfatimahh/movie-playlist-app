"use client";

import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b3a46] to-[#062a33] overflow-hidden text-white">

      {/* Center content */}
      <div className="z-11 text-center">
        <h1 className="text-5xl font-semibold mb-4">
          Your movie list is empty
        </h1>

       <button
  onClick={() => router.push("/add")}
  className="
    mt-6
    w-full
    max-w-sm
    py-3
    bg-green-400
    text-white
    font-semibold
    rounded-md
    hover:bg-green-300
    transition
  "
>
  Add a new movie
</button>

      </div>
      {/* Bottom waves */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">

        {/* Wave 1 */}
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-[220px]"
          preserveAspectRatio="none"
        >
          <path
            fill="#0c4f5a"
            fillOpacity="0.55"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,218.7C672,224,768,224,864,202.7C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,320L0,320Z"
          />
        </svg>

        {/* Wave 2 (mirrored) */}
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-[220px] absolute bottom-0 left-0 transform scale-x-[-1]"
          preserveAspectRatio="none"
        >
          <path
            fill="#0c4f5a"
            fillOpacity="0.35"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,218.7C672,224,768,224,864,202.7C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,320L0,320Z"
          />
        </svg>

      </div>
    </div>
  );
}
