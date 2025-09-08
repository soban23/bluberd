"use client";

import { useState, useEffect, FormEvent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { User, X } from "lucide-react";

import { signIn, signOut, useSession } from "next-auth/react";

import Spinner from "@/src/components/ui/chat/spinner";

import PostImage from "@/components/ui/postimage";

import PostCard from "@/components/ui/postCard";
const LikesModal = dynamic(() => import("@/components/likesModal"), {});

type posts = {
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
type commentData = {
  id: string;
  author_id?: string;
  commenter_lead?: string;
  content: string;
  created_at?: String;
};
type comments = {
  commentid: string;
  authorid: string;
  authorname: string;
  authorusername: string;
  authorpfp: string;
  content: string;
  numberoflikes: number;
  numberofcomments: number;
};

type User = {
  id: string;
  name: string;
  username: string;
  pfp: string;
  numberoffollowers: number;
  numberoffollowing: number;
};

interface Props {
  post_id?: string | null;
  comment_id?: string | null;
  forPost_user_id?: string | null;
  forComment_user_id?: string | null;
  onConsume?: () => void;
  newContent?: commentData | null;
  typeOfPosts?: string | null;
}

export default function FollowingPosts({
  typeOfPosts = null,
  forComment_user_id = null,
  forPost_user_id = null,
  post_id = null,
  comment_id = null,
  newContent,
  onConsume = () => {},
}: Props) {
  const router = useRouter();

  const { data: session } = useSession();
  const currentUsername = session?.user.username;

  const [posts, setPosts] = useState<posts[]>([]);
  const [comments, setComments] = useState<comments[]>([]);

  const [loading, setLoading] = useState(true);

  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );

  const [showCommentBox, setShowCommentBox] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<string>("");
  const [likedPosts, setLikedPosts] = useState<Set<string | null>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (post_id) {
      fetchComments();
      fetchUserCommentLikes();
    } else if (comment_id) {
      fetchCommentsOfCommentLead();
      fetchUserCommentLikes();
    } else if (forPost_user_id) {
      fetchUserPosts();
      fetchUserPostLikes();
    } else if (forComment_user_id) {
      fetchUserComments();
      fetchUserCommentLikes();
    } else if (typeOfPosts === "following") {
      fetchPostsOfFollowings();
      fetchUserPostLikes();
    } else if (typeOfPosts === "popular") {
      fetchPopularPosts();
      fetchUserPostLikes();
    } else {
      fetchPopularPosts();
      fetchUserPostLikes();
    }
  }, []);
  useEffect(() => {
    if (!newContent) return;

    const processNewComment = async () => {
      try {
        const user = await fetchUserData(newContent.author_id as string);

        const normalizedComment: comments = {
          commentid: newContent.id,
          authorid: session?.user.id || user.id,
          authorname: user.name,
          authorusername: user.username,
          authorpfp: user.pfp,
          content: newContent.content,
          numberoflikes: 0,
          numberofcomments: 0,
        };

        setComments((prev) => [normalizedComment, ...prev]);

        onConsume();
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    processNewComment();
  }, [newContent]);
  const fetchUserData = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();

      return data;
    } catch (error) {
      console.error("Failed to fetch error", error);
      return null;
    }
  };

  const fetchUserPostLikes = async () => {
    try {
      const res = await fetch(`/api/users/posts/likes`);
      const data: { post_id: string }[] = await res.json();

      const likedIds = data.map((item) => item.post_id);

      setLikedPosts(new Set(likedIds));
    } catch (error) {
      console.error("Failed to fetch user likes", error);
    }
  };

  const fetchUserCommentLikes = async () => {
    try {
      const res = await fetch(`/api/users/comments/likes`);
      const data: { comment_id: string }[] = await res.json();

      const likedIds = data.map((item) => item.comment_id);

      setLikedComments(new Set(likedIds));
    } catch (error) {
      console.error("Failed to fetch user likes", error);
    }
  };
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post_id}/comments/`);
      const data = await res.json();
      setComments(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${forPost_user_id}/posts/`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
      console.log(comments);
    }
  };
  const fetchUserComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${forComment_user_id}/comments/`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCommentsOfCommentLead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${comment_id}/comments/`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPostsOfFollowings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/followings");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPopularPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikesClick = ({
    postId = null,
    commentId = null,
  }: {
    postId?: string | null;
    commentId?: string | null;
  }) => {
    if (commentId) {
      setSelectedCommentId(commentId);
      setShowLikesModal(true);
    } else {
      setSelectedPostId(postId);
      setShowLikesModal(true);
    }
  };

  const handleCommentClick = ({
    postId = null,
    commentId = null,
  }: {
    postId?: string | null;
    commentId?: string | null;
  }) => {
    const id = postId || commentId;

    if (showCommentBox !== id) {
      setCommentContent("");
      setShowCommentBox(id);
    } else {
      setShowCommentBox(null);
    }
  };

  const handleClick = ({
    postId = null,
    commentId = null,
  }: {
    postId?: string | null;
    commentId?: string | null;
  }) => {
    if (commentId) {
      router.push(`/comments/${commentId}`);
    } else {
      router.push(`/posts/${postId}`);
    }
  };
  const handleProfileClick = (id: string) => {
    router.push(`/profile/${id}`);
  };

  const handleCommentSubmit = async (
    e: FormEvent,
    {
      postId = null,
      commentId = null,
    }: { postId?: string | null; commentId?: string | null }
  ) => {
    console.log("commentid", commentId, "postId", postId);
    e.preventDefault();

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

    if (res.ok) {
      setCommentContent("");
      setShowCommentBox(null);

      if (commentId) {
        setComments((prev) =>
          prev.map((p) =>
            p.commentid === commentId
              ? {
                  ...p,
                  numberofcomments: Number(p.numberofcomments) + Number(1),
                }
              : p
          )
        );
      } else {
        setPosts((prev) =>
          prev.map((p) =>
            p.postid === postId
              ? {
                  ...p,
                  numberofcomments: Number(p.numberofcomments) + Number(1),
                }
              : p
          )
        );
      }
    }
  };
  const createLike = async ({
    postId = null,
    commentId = null,
  }: {
    postId?: string | null;
    commentId?: string | null;
  }) => {
    try {
      let res;
      if (commentId) {
        res = await fetch(`/api/likes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: null, commentId: commentId }),
        });
      } else {
        res = await fetch(`/api/likes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });
      }
    } catch (error) {
      console.error("Failed to create my like", error);
    }
  };

  const deleteLike = async ({
    postId = null,
    commentId = null,
  }: {
    postId?: string | null;
    commentId?: string | null;
  }) => {
    try {
      let res;
      if (commentId) {
        res = await fetch(`/api/comments/${commentId}/likes`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
      } else {
        res = await fetch(`/api/posts/${postId}/likes`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
      }
    } catch (error) {
      console.error("Failed to delete my like", error);
    }
  };

  const toggleLike = ({
    postId = null,
    commentId = null,
  }: {
    postId?: string | null;
    commentId?: string | null;
  }) => {
    if (commentId) {
      const isLiked = likedComments.has(commentId);

      if (isLiked) {
        deleteLike({ commentId: commentId });
        setLikedComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
        setComments((prev) =>
          prev.map((p) =>
            p.commentid === commentId
              ? { ...p, numberoflikes: p.numberoflikes - 1 }
              : p
          )
        );
      } else {
        createLike({ commentId: commentId });
        setLikedComments((prev) => new Set(prev).add(commentId));
        setComments((prev) =>
          prev.map((p) =>
            p.commentid === commentId
              ? { ...p, numberoflikes: Number(p.numberoflikes) + Number(1) }
              : p
          )
        );
      }
    } else {
      const isLiked = likedPosts.has(postId);

      if (isLiked) {
        deleteLike({ postId: postId });
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.postid === postId
              ? { ...p, numberoflikes: p.numberoflikes - 1 }
              : p
          )
        );
      } else {
        createLike({ postId: postId });
        setLikedPosts((prev) => new Set(prev).add(postId));
        setPosts((prev) =>
          prev.map((p) =>
            p.postid === postId
              ? { ...p, numberoflikes: Number(p.numberoflikes) + Number(1) }
              : p
          )
        );
      }
    }
  };

  const handleDelete = async ({
    postId = null,
    commentId = null,
  }: {
    postId?: string | null;
    commentId?: string | null;
  }) => {
    try {
      let res;
      if (commentId) {
        res = await fetch(`/api/comments/${commentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        setComments((prevComments) =>
          prevComments.filter((comment) => comment.commentid !== commentId)
        );
      } else {
        res = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.postid !== postId)
        );
      }
    } catch (error) {
      console.error("Failed to delete post/comment", error);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : post_id || comment_id || forComment_user_id ? (
        <>
          {comments.map((comment) => (
            <div key={comment.commentid}>
              <PostCard
                key={comment.commentid}
                name={comment.authorname}
                username={comment.authorusername}
                avatar={comment.authorpfp}
                content={comment.content}
                likes={comment.numberoflikes}
                comments={comment.numberofcomments}
                isLiked={likedComments.has(comment.commentid)}
                isOwnPost={comment.authorusername === currentUsername}
                onLike={() => toggleLike({ commentId: comment.commentid })}
                onLikesClick={() =>
                  handleLikesClick({ commentId: comment.commentid })
                }
                onComment={() =>
                  handleCommentClick({ commentId: comment.commentid })
                }
                onCommentsClick={() =>
                  handleCommentClick({ commentId: comment.commentid })
                }
                onClick={() => handleClick({ commentId: comment.commentid })}
                onDelete={() => handleDelete({ commentId: comment.commentid })}
                onProfileClick={() => handleProfileClick(comment.authorid)}
              />

              {showCommentBox === comment.commentid && (
                <div className="w-full mx-auto max-w-xl mb-8">
                  <div className="relative border rounded-md shadow-sm bg-white dark:bg-gray-900 px-4 py-3 border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowCommentBox(null)}
                      className="absolute top-2 right-3 text-sm text-gray-400 hover:text-red-500"
                    >
                      <X />
                    </button>
                    <form
                      onSubmit={(e) =>
                        handleCommentSubmit(e, { commentId: comment.commentid })
                      }
                      className="flex flex-col gap-2"
                    >
                      <textarea
                        name="message"
                        required
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Write your comment..."
                        className="text-sm border rounded-md p-2 resize-none h-20 w-full focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="self-end bg-primary text-white text-sm px-4 py-1.5 rounded hover:bg-primary/90 disabled:opacity-50"
                      >
                        {loading ? "Sending..." : "Send"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {showLikesModal && selectedCommentId === comment.commentid && (
                <LikesModal
                  commentId={selectedCommentId}
                  onClose={() => setShowLikesModal(false)}
                />
              )}
            </div>
          ))}
        </>
      ) : (
        <>
          {posts.map((post) => (
            <div key={post.postid}>
              <PostCard
                key={post.postid}
                name={post.authorname}
                username={post.authorusername}
                avatar={post.authorpfp}
                content={post.content}
                image={post.contentimage}
                likes={post.numberoflikes}
                comments={post.numberofcomments}
                isLiked={likedPosts.has(post.postid)}
                isOwnPost={post.authorusername === currentUsername}
                onLike={() => toggleLike({ postId: post.postid })}
                onLikesClick={() => handleLikesClick({ postId: post.postid })}
                onComment={() => handleCommentClick({ postId: post.postid })}
                onCommentsClick={() =>
                  handleCommentClick({ postId: post.postid })
                }
                onClick={() => handleClick({ postId: post.postid })}
                onDelete={() => handleDelete({ postId: post.postid })}
                onProfileClick={() => handleProfileClick(post.authorid)}
              />

              {showCommentBox === post.postid && (
                <div className="w-full max-w-xl mx-auto mb-8">
                  <div className="relative border rounded-md shadow-sm bg-white dark:bg-gray-900 px-4 py-3 border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowCommentBox(null)}
                      className="absolute top-2 right-3 text-sm text-gray-400 hover:text-red-500"
                    >
                      <X />
                    </button>
                    <form
                      onSubmit={(e) =>
                        handleCommentSubmit(e, { postId: post.postid })
                      }
                      className="flex flex-col gap-2"
                    >
                      <textarea
                        name="message"
                        required
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Write your comment..."
                        className="text-sm border rounded-md p-2 resize-none h-20 w-full focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="self-end bg-primary text-black text-sm px-4 py-1.5 rounded hover:bg-primary/90 disabled:opacity-50"
                      >
                        {loading ? "Sending..." : "Send"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {showLikesModal && selectedPostId === post.postid && (
                <LikesModal
                  postId={selectedPostId}
                  onClose={() => setShowLikesModal(false)}
                />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
