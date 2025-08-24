import { supabase } from '@/lib/supabaseClient' // init with service role if in server-side

// 1️⃣ Start or find a conversation between two users (order IDs for uniqueness)
export async function getOrCreateConversation(userA: string, userB: string) {
  const [user1_id, user2_id] = userA < userB ? [userA, userB] : [userB, userA];

  // First try to fetch existing chat
  const { data: conv, error: fetchErr } = await supabase
    .from('conversations')
    .select('*')
    .eq('user1_id', user1_id)
    .eq('user2_id', user2_id)
    .limit(1)
    .single();
  if (fetchErr && fetchErr.code !== 'PGRST116') throw fetchErr; // ignore “no rows” error

  if (conv) return conv;

  // Otherwise, create new conversation
  const { data: newConv, error: insertErr } = await supabase
    .from('conversations')
    .insert({ user1_id, user2_id })
    .select('*')
    .single();

  if (insertErr) throw insertErr;
  return newConv;
}

// 2️⃣ List conversations with the other user's profile
export async function listConversationsForUser(userId: string) {
  const { data, error } = await supabase
    .rpc('get_conversations_by_userid', { p_user_id: userId })
  if (error) throw error
  return data
}

// 3️⃣ Delete a conversation (optional)
export async function deleteConversation(conversationId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .select('*');
  if (error) throw error;
  return data;
}
