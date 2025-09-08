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

export default function Post() {
  const { postId } = useParams();

  const postIdStr = String(postId);

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
      <ShowPost postId={postIdStr} refreshTrigger={refreshTrigger}></ShowPost>
      <CommentBox
        postId={postIdStr}
        onSubmitContent={(content) => setNewCommentContent(content)}
      ></CommentBox>
      <FollowingPosts
        post_id={postIdStr}
        newContent={newCommentContent}
        onConsume={() => setNewCommentContent(null)}
      ></FollowingPosts>
    </div>
  );
}
