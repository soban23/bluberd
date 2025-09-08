import { supabase } from "@/lib/supabaseClient";

export async function getCommentsByAuthorId(authorId: string) {
  const { data, error } = await supabase.rpc("get_comments_by_author_id", {
    author_id: authorId,
  });

  if (error) throw error;
  return data;
}

export async function getCommentsByPostId(postId: string) {
  const { data, error } = await supabase.rpc("get_comments_by_post_id", {
    post_id: postId,
  });

  if (error) throw error;
  return data;
}

export async function getCommentByCommentId(commentId: string) {
  const { data, error } = await supabase.rpc("get_comment_by_id", {
    comment_id: commentId,
  });

  if (error) throw error;
  return data?.[0];
}

export async function getCommentsOfCommentLead(commentLead: string) {
  const { data, error } = await supabase.rpc("get_comments_by_comment_lead", {
    lead_id: commentLead,
  });

  if (error) throw error;
  return data;
}

export async function createComment(
  content: string,
  postId: string,
  authorId: string,
  commentLead: string
) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      content,
      post_id: postId,
      author_id: authorId,
      commenter_lead: commentLead,
    })
    .select();

  if (error) throw error;
  return data;
}

export async function updateComment(
  content: string,
  commentId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId)
    .eq("author_id", userId)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: string, userId: string) {
  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", userId)
    .select();

  if (error) throw error;
  return data;
}
