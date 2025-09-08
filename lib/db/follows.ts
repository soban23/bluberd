import { supabase } from "@/lib/supabaseClient";

export async function getFollowersByUserId(userId: string) {
  const { data, error } = await supabase.rpc("get_followers_by_user_id", {
    user_id: userId,
  });

  if (error) throw error;
  return data;
}

export async function getFollowingsByUserId(userId: string) {
  const { data, error } = await supabase.rpc("get_followings_by_user_id", {
    follower_id: userId,
  });

  if (error) throw error;
  return data;
}

export async function checkIfFollowExist(userId: string, followerId: string) {
  const { data, error } = await supabase
    .from("follows")
    .select("*")
    .eq("user_id", userId)
    .eq("follower_id", followerId);

  if (error) throw error;
  return data;
}

export async function createFollowing(userId: string, followerId: string) {
  const { data, error } = await supabase
    .from("follows")
    .insert({ user_id: userId, follower_id: followerId })
    .select();

  if (error) throw error;
  return data;
}

export async function deleteFollows(userId: string, followerId: string) {
  const { data, error } = await supabase
    .from("follows")
    .delete()
    .eq("user_id", userId)
    .eq("follower_id", followerId)
    .select();

  if (error) throw error;
  return data;
}
