"use client";

import { useState, FormEvent, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { signIn, signOut, useSession } from "next-auth/react";
import Spinner from "@/src/components/ui/chat/spinner";

type commentData = {
  id: string;
  content: string;
};

interface CommentBoxProps {
  postId?: string | null;
  commentId?: string | null;
  onSubmitContent: (content: commentData) => void;
}

export default function CommentBox({
  postId = null,
  commentId = null,
  onSubmitContent,
}: CommentBoxProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [loadingSpin, setLoadingSpin] = useState(true);
  const [commentContent, setCommentContent] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      setLoadingSpin(false);
    }, 1000);
  }, []);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const content = commentContent;
    let res;

    if (commentId) {
      res = await fetch(`/api/comments/${commentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } else {
      res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId }),
      });
    }

    const data = await res.json();

    if (res.ok) {
      setCommentContent("");
      onSubmitContent(data[0]);
    }

    setLoading(false);
  };

  return (
    <>
      {loadingSpin ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <form
          onSubmit={handleCommentSubmit}
          className="w-full max-w-xl mx-auto flex items-start gap-3 mt-4 p-4 border rounded-md 
                           bg-white shadow-sm 
                           dark:bg-gray-900 dark:border-[#2f3336] dark:shadow-none"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user.image ?? ""} alt="You" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <Textarea
              name="message"
              placeholder="Write a comment..."
              required
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="min-h-[60px] resize-none text-sm 
                                   bg-white dark:bg-[#192734] 
                                   text-black dark:text-white 
                                   placeholder:text-gray-400 dark:placeholder:text-gray-500 
                                   border dark:border-[#2f3336]"
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="bg-[#1DA1F2] hover:bg-[#1A8CD8] text-white"
              >
                {loading ? "Posting..." : "Comment"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
