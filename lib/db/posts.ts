import { supabase } from "@/lib/supabaseClient";

export async function getPostsByUserId(userId: string) {
  const { data, error } = await supabase.rpc("get_posts_by_user_id", {
    author_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function getPostByPostId(postId: string) {
  const { data, error } = await supabase.rpc("get_post_by_id", {
    post_id: postId,
  });
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function getPostsOfFollowings(userId: string) {
  const { data, error } = await supabase.rpc("get_posts_of_followings", {
    user_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function getPopularPosts() {
  const { data, error } = await supabase.rpc("get_popular_posts");
  if (error) throw error;
  return data;
}

export async function checkAuthorSameAsUser(postId: string, userId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("author_id", userId);
  if (error) throw error;
  return data;
}

export async function createPost(
  authorId: string,
  content: string,
  image: string
) {
  const { data, error } = await supabase
    .from("posts")
    .insert({ author_id: authorId, content, image })
    .select();
  if (error) throw error;
  return data;
}

export async function updatePost(
  postId: string,
  content: string,
  image: string
) {
  const { data, error } = await supabase
    .from("posts")
    .update({ content, image })
    .eq("id", postId)
    .select();
  if (error) throw error;
  return data;
}

export async function deletePost(postId: string) {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .select();
  if (error) throw error;
  return data;
}
