"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ShowPost = dynamic(() => import("@/components/showPost"), {});

const CommentBox = dynamic(() => import("@/components/commentBox"), {});

const FollowingPosts = dynamic(() => import("@/components/followingPosts"), {});

type comments = {
  commentid: string;
  authorname: string;
  authorusername: string;
  authorpfp: string;
  content: string;
  numberoflikes: number;
  numberofcomments: number;
};

type commentData = {
  id: string;
  author_id?: string;
  commenter_lead?: string;
  content: string;
  created_at?: String;
};
export default function Comment() {
  const { commentId } = useParams();

  const commentIdStr = String(commentId);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [newCommentContent, setNewCommentContent] =
    useState<commentData | null>(null);

  useEffect(() => {
    if (newCommentContent !== null) {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [newCommentContent]);

  return (
    <div className="">
      <ShowPost
        commentId={commentIdStr}
        refreshTrigger={refreshTrigger}
      ></ShowPost>
      <CommentBox
        commentId={commentIdStr}
        onSubmitContent={(content) => setNewCommentContent(content)}
      ></CommentBox>
      <FollowingPosts
        comment_id={commentIdStr}
        newContent={newCommentContent}
        onConsume={() => setNewCommentContent(null)}
      ></FollowingPosts>
    </div>
  );
}
