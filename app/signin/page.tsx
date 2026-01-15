"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/main"); // ✅ SIGN IN → MAIN
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b3a46] to-[#062a33] overflow-hidden">

      <div className="z-10 w-full max-w-sm text-center text-white">
        <h1 className="text-6xl font-semibold mb-8">Sign in</h1>

        {/* ✅ CONNECTED HERE */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-white/10 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-md bg-white/10 text-white"
          />

          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="accent-green-400" />
            <span>Remember me</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-green-400 text-white font-semibold"
          >
            Login
          </button>

          {/* signup link */}
          <p className="text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-green-400 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* Bottom Waves */}
<div className="absolute bottom-0 left-0 w-full overflow-hidden">

  {/* Wave from LEFT */}
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

  {/* Wave from RIGHT (Exact mirror) */}
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
