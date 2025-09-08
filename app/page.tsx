"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Spinner from "@/src/components/ui/chat/spinner";

export default function LoginPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session) {
      window.location.href = "/home";
    }
    setLoading(false);
  }, [session]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner></Spinner>
        </div>
      ) : (
        <>
          <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-sm border border-gray-700 w-full bg-gray-900 rounded-xl shadow-lg p-8">
              <div className="text-white text-2xl font-semibold text-center mb-6">
                Welcome{" "}
              </div>

              <button
                onClick={() => signIn("google")}
                className="w-full bg-white text-gray-800 py-2 px-4 rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 transition duration-200"
              >
                <GoogleIcon />
                <span className="font-medium">Sign in with Google</span>
              </button>

              <p className="text-center text-sm text-gray-400 mt-6">
                Powered by Google Login
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.3H272.1v95.2h146.8c-6.3 33.8-25.1 62.4-53.7 81.7v67.9h86.8c50.7-46.7 81.5-115.6 81.5-194.5z"
        fill="#4285F4"
      />
      <path
        d="M272.1 544.3c72.9 0 134-24.1 178.6-65.6l-86.8-67.9c-24.1 16.2-55 25.8-91.8 25.8-70.6 0-130.5-47.7-151.9-111.4H30.3v69.8c44.8 88.3 136.8 149.3 241.8 149.3z"
        fill="#34A853"
      />
      <path
        d="M120.2 325.1c-10.2-30.3-10.2-62.7 0-93l-89.9-69.8C-3.2 231.6-3.2 312.7 30.3 375l89.9-69.9z"
        fill="#FBBC04"
      />
      <path
        d="M272.1 107.4c39.7 0 75.4 13.6 103.4 40.5l77.6-77.6C406 24.1 344.9 0 272.1 0 167.1 0 75.1 61 30.3 149.3l89.9 69.8c21.4-63.7 81.3-111.7 151.9-111.7z"
        fill="#EA4335"
      />
    </svg>
  );
}
