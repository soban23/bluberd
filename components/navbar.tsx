"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Home, Search, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function BottomNav() {
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();
  const isHidden = pathname === "/" || pathname.startsWith("/conversation");

  if (isHidden || !session) return null;

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-900 shadow-lg rounded-full px-6 py-2 w-[90%] max-w-md flex justify-between items-center backdrop-blur-md border dark:border-gray-700">
      <NavItem
        icon={<Home onClick={() => router.push("/home")} className="w-6 h-6" />}
      />
      <NavItem
        icon={
          <Search onClick={() => router.push("/search")} className="w-6 h-6" />
        }
      />
      <NavItem
        icon={
          <MessageCircle
            onClick={() => router.push(`/conversations`)}
            className="w-6 h-6"
          />
        }
      />
      <NavItem
        icon={
          <Avatar
            onClick={() => router.push(`/profile/${session.user.id}`)}
            className="w-7 h-7"
          >
            {session?.user.image && <AvatarImage src={session?.user.image} />}
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
        }
      />
    </nav>
  );
}

function NavItem({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
      {icon}
    </button>
  );
}
