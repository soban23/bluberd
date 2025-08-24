// import pool from '@/lib/db'       

// //  user_id | follower_id



// export async function getFollowersByUserId(userId: string) {
//   const result = await pool.query(`
//     SELECT
//   u.id AS userId,
//   u.name AS name,
//   u.username AS username,
//   u.pfp AS pfp,
// FROM follows f 
// JOIN users u on f.follower_id = u.id 
// WHERE f.user_id = $1

// ;

//     `, [userId]);
//   return result.rows;
// }

// export async function getFollowingsByUserId(userId: string) {
//   const result = await pool.query(`
//     SELECT
//   u.id AS userId,
//   u.name AS name,
//   u.username AS username,
//   u.pfp AS pfp,
// FROM follows f 
// JOIN users u on f.user_id = u.id 
// WHERE f.follower_id = $1

// ;

//     `, [userId]);
//   return result.rows;
// }

// export async function checkIfFollowExist(userId: string, followerId: string) {
//   const result = await pool.query('SELECT * FROM follows WHERE follower_id = $1 and user_id = $2'
//     , [followerId, userId]);
//   return result.rows;
// }

// export async function createFollowing(userId: string, followerId: string ) {
//   const result = await pool.query(
//         'INSERT INTO follows (user_id, follower_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
//         [userId, followerId]
//       )
//   return result.rows;
// }



// export async function deleteFollows(userId: string, followerId: string ) {
//   const result = await pool.query(
//     'DELETE from follows WHERE user_id = $1 AND follower_id = $2 RETURNING *',
//     [userId, followerId]
//   );
//   return result.rows;
// }


import { supabase } from '@/lib/supabaseClient'

// ✅ Get all followers of a user
export async function getFollowersByUserId(userId: string) {
  const { data, error } = await supabase
    .rpc('get_followers_by_user_id', { user_id: userId });

  if (error) throw error;
  return data;
}

// ✅ Get all people a user is following
export async function getFollowingsByUserId(userId: string) {
  const { data, error } = await supabase
    .rpc('get_followings_by_user_id', { follower_id: userId });

  if (error) throw error;
  return data;
}

// ✅ Check if user A follows user B
export async function checkIfFollowExist(userId: string, followerId: string) {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('user_id', userId)
    .eq('follower_id', followerId);

  if (error) throw error;
  return data;
}

// ✅ Follow user (A follows B)
export async function createFollowing(userId: string, followerId: string) {
  const { data, error } = await supabase
    .from('follows')
    .insert({ user_id: userId, follower_id: followerId })
    .select();

  if (error) throw error;
  return data;
}

// ✅ Unfollow user
export async function deleteFollows(userId: string, followerId: string) {
  const { data, error } = await supabase
    .from('follows')
    .delete()
    .eq('user_id', userId)
    .eq('follower_id', followerId)
    .select();

  if (error) throw error;
  return data;
}
