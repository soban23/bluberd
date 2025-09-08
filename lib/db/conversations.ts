import { supabase } from "@/lib/supabaseClient";
export async function getOrCreateConversation(userA: string, userB: string) {
  const [user1_id, user2_id] = userA < userB ? [userA, userB] : [userB, userA];

  // First try to fetch existing chat
  const { data: conv, error: fetchErr } = await supabase
    .from("conversations")
    .select("*")
    .eq("user1_id", user1_id)
    .eq("user2_id", user2_id)
    .limit(1)
    .single();
  if (fetchErr && fetchErr.code !== "PGRST116") throw fetchErr;

  if (conv) return conv;

  const { data: newConv, error: insertErr } = await supabase
    .from("conversations")
    .insert({ user1_id, user2_id })
    .select("*")
    .single();

  if (insertErr) throw insertErr;
  return newConv;
}

export async function listConversationsForUser(userId: string) {
  const { data, error } = await supabase.rpc("get_conversations_by_userid", {
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}
export async function deleteConversation(conversationId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .select("*");
  if (error) throw error;
  return data;
}
