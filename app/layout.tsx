//'use client';

// import type { Metadata } from "next";
// import { usePathname } from 'next/navigation';
// import { useState } from "react";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// import AuthProvider from "@/components/AuthProvider";
// import CreatePostModal from "@/components/createPostModal";

// // Optional: Lucide icon
// import { MessageCirclePlus } from 'lucide-react';

// export const metadata: Metadata = {
//   title: "bluberd",
//   description: "Generated b",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const [showModal, setShowModal] = useState(false);

//   // Don't show on /messages or any other restricted path
//   const restrictedRoutes = ['/conversation'];

//   const shouldShowFloatingButton = !restrictedRoutes.some(route =>
//     pathname.startsWith(route)
//   );

//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           {children}

//           {/* Floating button */}
//           {shouldShowFloatingButton && (
//             <>
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="fixed bottom-5 right-5 z-50 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200"
//                 aria-label="Create Post"
//               >
//                 <MessageCirclePlus className="w-6 h-6" />
//               </button>

//               <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
//             </>
//           )}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import FloatingCreatePostButton from "@/components/floatingButton";

import BottomNav from "@/components/navbar";
//import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: "bluberd",
  description: "Generated b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark"> 
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
        <AuthProvider>
          <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
  <div className="max-w-4xl mx-auto flex items-center justify-center px-4 py-3">
    <div className="flex items-center gap-2">
      <img
        src="/bluberd.png" 
        alt="bluberd logo"
        className="w-6 h-6"
      />
      <span className="text-xl font-semibold text-black dark:text-white">
        BluBerd
      </span>
    </div>
  </div>
</header>

          {children}
          <FloatingCreatePostButton />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
