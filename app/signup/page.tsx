"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
   const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b3a46] to-[#062a33] overflow-hidden">
      
      {/* Form */}
      <div className="z-10 w-full max-w-sm text-center text-white">
        <h1 className="text-4xl font-semibold mb-8">Sign up</h1>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push("/main"); }}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-green-400 text-white font-semibold hover:bg-green-300 transition"
          >
            Signup
          </button>
        </form>

        {/* Back to Sign in */}
       <p className="mt-6 text-sm text-gray-300">
  Already have an account?{" "}
  <Link href="/" className="text-green-400 hover:underline">
    Sign in
  </Link>
</p>

      </div>

      {/* Bottom Waves */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
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
