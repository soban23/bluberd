'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';


import Spinner from '@/src/components/ui/chat/spinner'
          


const LikesModal = dynamic(() => import('@/components/likesModal'), {
//   loading: () => <p>Loading likes...</p>,
});

const PostStats = dynamic(() => import('@/components/postStats'), {
//   loading: () => <p>Loading stats...</p>,
});

type Post = {
  postid: string;
  authorid: string;
  authorname: string;
  authorusername: string;
  authorpfp: string;
  content: string;
  contentimage: string;
  numberoflikes: number;
  numberofcomments: number;
};

type Comment = {
  commentid: string;
  authorid: string;
  authorname: string;
  authorusername: string;
  authorpfp: string;
  content: string;
  numberoflikes: number;
  numberofcomments: number;
};

interface ShowPostProps {
  postId?: string | null;
  commentId?: string | null;
  refreshTrigger: number;
}

type LikeId = {
  id: string;
};

export default function ShowPost({ postId = null, commentId = null, refreshTrigger }: ShowPostProps) {
  const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState<LikeId>();
  const firstRun = useRef(true);

//   useEffect(() => {
//   LikesModal.preload();
//   PostStats.preload();
// }, []);

  useEffect(() => {
    if (commentId) {
      fetchComment();
      fetchMyCommentLike();
    } else {
      fetchPost();
      fetchMyPostLike();
    }
  }, []);

  useEffect(() => {
    if (commentId) {
      setComment(prev => prev && { ...prev, numberofcomments: prev.numberofcomments + 1 });
    } else {
      setPost(prev => prev && { ...prev, numberofcomments: prev.numberofcomments + 1 });
    }
  }, [refreshTrigger]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`);
      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPostLike = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/myLike`);
      const data = await res.json();
      setLikeId(data);
      setLiked(data.length > 0);
    } catch (error) {
      console.error('Failed to fetch my like', error);
    }
  };

  const fetchComment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${commentId}`);
      const data = await res.json();
      console.log('data of comments',data)
      setComment(data);
    } catch (error) {
      console.error('Failed to fetch comment', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCommentLike = async () => {
    try {
      const res = await fetch(`/api/comments/${commentId}/myLike`);
      const data = await res.json();
      setLikeId(data);
      setLiked(data.length > 0);
    } catch (error) {
      console.error('Failed to fetch my like', error);
    }
  };

  const handleLikeButton = async () => {
    if (commentId && comment) {
      setLiked(prev => !prev);
      setComment(prev =>
        prev ? { ...prev, numberoflikes: prev.numberoflikes + (liked ? -1 : 1) } : prev
      );
      liked ? await deleteLike({ commentId }) : await createLike({ commentId });
    } else if (postId && post) {
      setLiked(prev => !prev);
      setPost(prev =>
        prev ? { ...prev, numberoflikes: prev.numberoflikes + (liked ? -1 : 1) } : prev
      );
      liked ? await deleteLike({ postId }) : await createLike({ postId });
    }
  };

  const createLike = async ({ postId = null, commentId = null }: { postId?: string | null; commentId?: string | null }) => {
    try {
      await fetch(`/api/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, commentId }),
      });
    } catch (error) {
      console.error('Failed to create like', error);
    }
  };

  const deleteLike = async ({ postId = null, commentId = null }: { postId?: string | null; commentId?: string | null }) => {
    try {
      if (postId) {
        await fetch(`/api/posts/${postId}/likes`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      } else if (commentId) {
        await fetch(`/api/comments/${commentId}/likes`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      console.error('Failed to delete like', error);
    }
  };

  const renderContent = () => {
  const data = commentId ? comment : post;
  const isComment = !!commentId;
  if (!data) return null;

  return (
    <Card className="w-full max-w-xl mx-auto mt-6 rounded-lg shadow-md dark:bg-gray-900">
      <CardHeader className="flex items-center gap-3">
        <Avatar className=' hover:underline cursor-pointer' onClick={() => router.push(`/profile/${data.authorid}`)}>
          <AvatarImage src={data.authorpfp} alt={data.authorname} />
          <AvatarFallback>{data.authorname[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p
            onClick={() => router.push(`/profile/${data.authorid}`)}
            className=" hover:underline cursor-pointer font-semibold text-black dark:text-white"
          >
            {data.authorname}
          </p>
          <p
            onClick={() => router.push(`/profile/${data.authorid}`)}
            className=" hover:underline cursor-pointer text-sm text-gray-500 dark:text-gray-400"
          >
            @{data.authorusername}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {post?.contentimage && !isComment && (
          <img
            src={post.contentimage}
            alt="Post content"
            className="rounded-md w-full max-h-80 object-cover"
          />
        )}
        <p className="text-gray-800 dark:text-gray-100">{data.content}</p>

        <div className="flex items-center gap-6">
          <div
            onClick={handleLikeButton}
            className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition"
          >
            {liked ? (
              <Heart fill="red" className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </div>
        </div>

        <PostStats
          numberOfLikes={data.numberoflikes}
          numberOfComments={data.numberofcomments}
          postId={postId ?? undefined}
          commentId={commentId ?? undefined}
        />
      </CardContent>
    </Card>
  );
};

return (
  <div>
    {loading ? (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    ) : (
      renderContent()
    )}
  </div>
);

}
