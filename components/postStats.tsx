'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import Spinner from '@/src/components/ui/chat/spinner'

const LikesModal = dynamic(() => import('@/components/likesModal'), {
  // loading: () => <p>Loading likes...</p>,
});

interface Props {
  numberOfLikes: number;
  numberOfComments: number;
  postId?: string | null;
  commentId?: string | null;
}

export default function PostStats({
  numberOfLikes,
  numberOfComments,
  postId = null,
  commentId = null,
}: Props) {

  // const [loading, setLoading] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);

  useEffect(() => {
    // You already have the values passed as props
    // Optionally useEffect can be used for logging
    console.log('Stats mounted with likes/comments:', numberOfLikes, numberOfComments);
  }, []);

  const handleLikesClick = () => {
    setShowLikesModal((prev) => !prev);
  };

  return (
  <div className="w-full flex items-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-300">
    <>
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-black dark:hover:text-white transition"
        onClick={handleLikesClick}
      >
        Likes <span>{numberOfLikes}</span>
      </div>
      <div className="flex items-center gap-1">
        Comments <span>{numberOfComments}</span>
      </div>

      {showLikesModal && postId && (
        <LikesModal postId={postId} onClose={() => setShowLikesModal(false)} />
      )}
      {showLikesModal && commentId && (
        <LikesModal commentId={commentId} onClose={() => setShowLikesModal(false)} />
      )}
    </>
  </div>
);

}
