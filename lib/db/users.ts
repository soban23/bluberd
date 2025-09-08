import { supabase } from "../supabaseClient";

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user:", error);
    throw error;
  }

  return data ? data : null;
}

export async function getUserByUsername(username: string) {
  const { data, error } = await supabase.rpc("get_user_by_username", {
    username,
  });
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function getUserById(id: string) {
  const { data, error } = await supabase.rpc("get_user_by_id", {
    p_user_id: id,
  });
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function checkUsernameExist(username: string, userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .neq("id", userId)
    .limit(1);
  if (error) throw error;
  return data;
}
export async function getUsers() {
  const { data, error } = await supabase.from("users").select();

  if (error) throw error;
  return data;
}
export async function createUser(
  username: string,
  email: string,
  pfp: string,
  name: string
) {
  const { data, error } = await supabase
    .from("users")
    .insert({ username, email, pfp, name })
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateUser(
  id: string,
  username: string,
  pfp: string,
  name: string,
  bio: string
) {
  const { data, error } = await supabase
    .from("users")
    .update({ username, pfp, name, bio })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteUser(id: string) {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw error;
  return data;
}
