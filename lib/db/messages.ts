import { supabase } from "@/lib/supabaseClient";

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content?: string,
  attachmentUrl?: string
) {
  if (!content && !attachmentUrl) {
    throw new Error("Message must include content or an attachment");
  }

  const { data, error } = await supabase.rpc("send_message_with_user", {
    p_conversation_id: conversationId,
    p_sender_id: senderId,
    p_content: content || null,
    p_attachment_url: attachmentUrl || null,
  });

  if (error) throw error;
  return data[0];
}

export async function sendMessage1(
  conversationId: string,
  senderId: string,
  content?: string,
  attachmentUrl?: string
) {
  if (!content && !attachmentUrl) {
    throw new Error("Message must include content or an attachment");
  }
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      attachment_url: attachmentUrl || null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function fetchMessages(
  conversationId: string,
  before?: string | null
) {
  const { data, error } = await supabase.rpc(
    "get_messages_by_conversation_id_cursor",
    {
      p_conversation_id: conversationId,
      p_before: before || undefined,
    }
  );

  if (error) {
    console.error("Supabase fetchMessages error:", error);
    throw error;
  }

  return data;
}

export async function fetchMessages1(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      conversation_id,
      sender_id,
      content,
      attachment_url,
      created_at,
      sender:profiles!messages_sender_id_fkey(
        id,
        username,
        pfp,
        name
      )
    `
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data.map((msg) => ({
    id: msg.id,
    conversation_id: msg.conversation_id,
    sender: msg.sender,
    content: msg.content,
    attachment_url: msg.attachment_url,
    created_at: msg.created_at,
  }));
}

export async function deleteMessage(messageId: string, userId: string) {
  const { data, error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .eq("sender_id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
