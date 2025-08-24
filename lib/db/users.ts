//import pool from '@/lib/db'       
import { supabase } from '../supabaseClient'

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching user:', error)
    throw error
  }

  return data ? [data] : []
}


// id | username | email | pfp | created_at

// export async function getUserByUsername(username: string) {
//   const result = await pool.query(`
//     SELECT
//   u.id AS userId,
//   u.name AS name,
//   u.username AS username,
//   u.pfp AS pfp,
//   COUNT(DISTINCT f1.user_id) AS numberOfFollowers,
//   COUNT(DISTINCT f2.follower_id) AS numberOfFollowings
// FROM users u 
// LEFT JOIN follows f1 on f1.user_id = u.id 
// LEFT JOIN follows f2 on f1.follower_id = u.id 

// WHERE u.username = $1
// GROUP BY u.id, u.name, u.username, u.pfp
// ;

//     `, [username]);
//   return result.rows;
// }

// export async function getUserById(id: string) {
//   const result = await pool.query(`
//     SELECT
//   u.id AS userId,
//   u.name AS name,
//   u.username AS username,
//   u.pfp AS pfp,
//   COUNT(DISTINCT f1.follower_id) AS numberOfFollowers,
//   COUNT(DISTINCT f2.user_id) AS numberOfFollowing
// FROM users u 
// LEFT JOIN follows f1 on f1.user_id = u.id 
// LEFT JOIN follows f2 on f2.follower_id = u.id 

// WHERE u.id = $1
// GROUP BY u.id, u.name, u.username, u.pfp
// ;

//     `, [id]);
//   return result.rows;
// }

// export async function getUserByEmail1(email: string) {
//   const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//   return result.rows;
// }

// export async function checkUsernameExist(username: string, userId: string) {
//   const result = await pool.query('SELECT * FROM users WHERE username = $1 AND id != $2'
//     , [username, userId]);
//   return result.rows;
// }

// export async function createUser(username: string, email: string, pfp: Buffer, name: string) {
//   const result = await pool.query(
//         'INSERT INTO users (username, email, pfp, name) VALUES ($1, $2, $3, $4) RETURNING *',
//         [username, email, pfp, name]
//       )
//   return result.rows;
// }

// export async function updateUser(id: string, username: string, pfp: Buffer, name: string) {
//   const result = await pool.query(
//     'UPDATE users SET username = $1, pfp = $2, name = $3 WHERE id = $4 RETURNING *',
//     [username, pfp, name, id]
//   );
//   return result.rows;
// }

// export async function deleteUser(id: string) {
//   const result = await pool.query(
//     'DELETE from users WHERE id = $1 RETURNING *',
//     [id]
//   );
//   return result.rows;
// }


// ✅ Get by username
export async function getUserByUsername(username: string) {
  const { data, error } = await supabase.rpc('get_user_by_username', { username })
  if (error) throw error
  return data?.[0] ?? null
}

// ✅ Get by ID
export async function getUserById(id: string) {
  const { data, error } = await supabase.rpc('get_user_by_id', { p_user_id: id })
  if (error) throw error
  return data?.[0] ?? null
}

// ✅ Get by email
// export async function getUserByEmail(email: string) {
//   const { data, error } = await supabase
//     .from('users')
//     .select('*')
//     .eq('email', email)
//   if (error) throw error
//   return data?.[0] ?? null
// }

// ✅ Check if username exists for someone else
export async function checkUsernameExist(username: string, userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id') // Only select 'id' for efficiency
    .eq('username', username)
    .neq('id', userId)
    .limit(1); // We only need to know if one exists
  if (error) throw error
  return data
}
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select() 
    
  if (error) throw error
  return data
}
// ✅ Create user
export async function createUser(username: string, email: string, pfp: string, name: string) {
  const { data, error } = await supabase
    .from('users')
    .insert({ username, email, pfp, name })
    .select()
  if (error) throw error
  return data
}

// ✅ Update user
export async function updateUser(id: string, username: string, pfp: string, name: string, bio: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ username, pfp, name, bio })
    .eq('id', id)
    .select()
  if (error) throw error
  return data
}

// ✅ Delete user
export async function deleteUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
    .select()
  if (error) throw error
  return data
}
