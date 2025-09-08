import { supabase } from "@/lib/supabaseClient";

export async function getPostLikesByUserId(userId: string) {
  const { data, error } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching post likes:", error);
    throw error;
  }

  return data;
}

export async function getLikesByCommentId(commentId: string) {
  const { data, error } = await supabase.rpc("get_likes_by_comment_id", {
    comment_id: commentId,
  });

  if (error) {
    console.error("Error from Supabase RPC:", error);
    throw error;
  }

  return data;
}

export async function checkLikeAlreadyExist(userId: string, postId: string) {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", userId)
    .eq("post_id", postId);

  if (error) {
    console.error("Error checking post like:", error);
    throw error;
  }

  return data;
}
export async function checkCommentLikeAlreadyExist(
  userId: string,
  commentId: string
) {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", userId)
    .eq("comment_id", commentId);

  if (error) {
    console.error("Error checking comment like:", error);
    throw error;
  }

  return data;
}

export async function createLike(
  userId: string,
  postId: string | null,
  commentId: string | null
) {
  const { data, error } = await supabase
    .from("likes")
    .insert([
      {
        user_id: userId,
        post_id: postId,
        comment_id: commentId,
      },
    ])
    .select()
    .single();

  if (error && error.code !== "23505") {
    console.error("Error creating like:", error);
    throw error;
  }

  return data ? [data] : [];
}
export async function deleteLike(likeId: string, userId: string) {
  const { data, error } = await supabase
    .from("likes")
    .delete()
    .eq("id", likeId)
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error("Error deleting like:", error);
    throw error;
  }

  return data;
}

export async function deleteLikeByPostId(postId: string, userId: string) {
  const { data, error } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error("Error deleting like by postId:", error);
    throw error;
  }

  return data;
}

export async function deleteLikeByCommentId(commentId: string, userId: string) {
  const { data, error } = await supabase
    .from("likes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error("Error deleting like by commentId:", error);
    throw error;
  }

  return data;
}

export async function getCommentLikesByUserId(userId: string) {
  const { data, error } = await supabase
    .from("likes")
    .select("comment_id")
    .eq("user_id", userId)
    .not("comment_id", "is", null);

  if (error) {
    console.error("Error getting comment likes:", error);
    throw error;
  }

  return data;
}
