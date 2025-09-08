"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import Spinner from "@/src/components/ui/chat/spinner";
import { useRouter } from "next/navigation";

type Likes = {
  likeid: string;
  userid: string;
  name: string;
  userpfp: string;
};

interface LikesModalProps {
  postId?: string | null;
  commentId?: string | null;
  onClose: () => void;
}

export default function LikesModal({
  postId = null,
  commentId = null,
  onClose,
}: LikesModalProps) {
  const router = useRouter();
  const [likes, setLikes] = useState<Likes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      let res;
      if (commentId && !postId) {
        res = await fetch(`/api/comments/${commentId}/likes`);
      } else if (postId && !commentId) {
        res = await fetch(`/api/posts/${postId}/likes`);
      } else {
        return;
      }

      const data = await res.json();

      setLikes(data);
    } catch (error) {
      console.error("Failed to fetch Likes", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md rounded-lg shadow-md bg-white dark:bg-gray-900 max-h-[80vh] overflow-hidden">
        <CardHeader className="flex items-center justify-between border-b px-4 py-3 border-gray-200 dark:border-gray-700">
          <CardTitle className="text-base text-black dark:text-white">
            Liked by
          </CardTitle>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white text-sm font-bold"
            aria-label="Close"
          >
            <X />
          </button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[60vh] px-4 py-3 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          ) : likes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No likes yet.
            </p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {likes.map((like) => (
                <div
                  onClick={() => router.push(`/profile/${like.userid}`)}
                  key={like.likeid}
                  className="flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <Avatar>
                    <AvatarImage src={like.userpfp} alt={like.name} />
                    <AvatarFallback>{like.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {like.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
