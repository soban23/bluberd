"use client";

import dynamic from "next/dynamic";

import { useParams } from "next/navigation";

import { useState, useEffect, FormEvent } from "react";

const Profile = dynamic(() => import("@/components/profile"), {});

const FollowingPosts = dynamic(() => import("@/components/followingPosts"), {});

const CreatePostModal = dynamic(
  () => import("@/components/createPostModal"),
  {}
);

export default function UserProfile() {
  const { userId } = useParams();

  const userIdStr = String(userId);
  const [showModal, setShowModal] = useState(false);
  const [postsParam, setPostParam] = useState<boolean>(true);

  const [commentsParam, setCommentsParam] = useState<boolean>(false);
  const handleTabs = async (tab: string) => {
    if (tab === "posts") {
      setPostParam(true);
      setCommentsParam(false);
    } else if (tab === "comments") {
      setPostParam(false);
      setCommentsParam(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <Profile userId={userIdStr} />

      <div className="flex">
        <button
          onClick={() => handleTabs("posts")}
          className={`flex-1 py-2 text-center ${
            postsParam
              ? "border-b-2 border-blue-500 font-semibold text-blue-600"
              : "text-gray-500"
          }`}
        >
          Posts
        </button>

        <button
          onClick={() => handleTabs("comments")}
          className={`flex-1 py-2 text-center ${
            commentsParam
              ? "border-b-2 border-blue-500 font-semibold text-blue-600"
              : "text-gray-500"
          }`}
        >
          Comments
        </button>
      </div>

      <div style={{ display: postsParam ? "block" : "none" }}>
        <FollowingPosts forPost_user_id={userIdStr} />
      </div>

      <div style={{ display: commentsParam ? "block" : "none" }}>
        <FollowingPosts forComment_user_id={userIdStr} />
      </div>
    </div>
  );
}
