"use client";

import { useState } from "react";
import CreatePostModal from "@/components/createPostModal";

import { usePathname } from "next/navigation";

import { MessageCirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn, useSession, signOut } from "next-auth/react";

export default function FloatingCreatePostButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    }
  }, [session, status, router]);

  const pathname = usePathname();
  const isHidden = pathname === "/" || pathname.startsWith("/conversation");

  const [isOpen, setIsOpen] = useState(false);
  if (isHidden) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[5.5rem] right-5 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        <MessageCirclePlus />
      </button>

      <CreatePostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
