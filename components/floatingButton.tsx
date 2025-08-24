// components/FloatingCreatePostButton.tsx
'use client';

import { useState } from 'react';
import CreatePostModal from '@/components/createPostModal';

import { usePathname } from 'next/navigation';



import { MessageCirclePlus } from 'lucide-react';

export default function FloatingCreatePostButton() {
    const pathname = usePathname();
    const isHidden = pathname === '/' ||pathname.startsWith('/conversation');
  

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
