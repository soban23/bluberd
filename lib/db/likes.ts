//import pool from '@/lib/db'       

//  id | user_id | post_id | comment_id | created_at



// export async function getPostLikesByUserId1(userId: string) {
//   const result = await pool.query('SELECT post_id FROM likes WHERE user_id = $1', [userId]);
//   return result.rows;
// }

import { supabase } from '@/lib/supabaseClient'

export async function getPostLikesByUserId(userId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching post likes:', error)
    throw error
  }

  return data
}

// export async function getCommentLikesByUserId(userId: string) {
//   const result = await pool.query('SELECT comment_id FROM likes WHERE user_id = $1', [userId]);
//   return result.rows;
// }

// export async function getLikesByPostId(postId: string) {
//   const result = await pool.query(`
//     SELECT
//   l.id AS likeId,
//   u.id AS userId,
//   u.pfp AS userPfp,
//   u.name AS name
  
// FROM likes l 
// JOIN users u ON l.user_id=u.id
// WHERE l.post_id=$1
// ORDER BY l.created_at DESC
//     `, [postId]);
//   return result.rows;
// }

// export async function getLikesbyCommentId(commentId: string) {
 
//   const result = await pool.query(`
//     SELECT
//   l.id AS likeId,
//   u.id AS userId,
//   u.pfp AS userPfp,
//   u.name AS name
  
// FROM likes l 
// JOIN users u ON l.user_id=u.id
// WHERE l.comment_id=$1
// ORDER BY l.created_at DESC
//     `, [commentId]);
//   return result.rows;
// }

// export async function checkLikeAlreadyExist(userId: string, postId: string ) {
//   const result = await pool.query('SELECT * FROM likes WHERE post_id = $1 AND user_id = $2 '
//     , [postId, userId]);
//   return result.rows;
// }

// export async function checkCommentLikeAlreadyExist(userId: string, commentId: string ) {
//   const result = await pool.query('SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2 '
//     , [commentId, userId]);
//   return result.rows;
// }
// export async function createLike(userId: string, postId: string | null, commentId: string ) {
//   const result = await pool.query(
//         'INSERT INTO likes (user_id, post_id, comment_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING * ',
//         [userId, postId, commentId]
//       )
//   return result.rows;
// }


// export async function deleteLike(likeId: string, userId: string) {
//   const result = await pool.query(
//     'DELETE from likes WHERE id = $1 and user_id = $2 RETURNING *',
//     [likeId, userId]
//   );
//   return result.rows;
// }

// export async function deleteLikeByPostId(postId: string, userId: string) {
//   const result = await pool.query(
//     'DELETE from likes WHERE post_id = $1 and user_id = $2 RETURNING *',
//     [postId, userId]
//   );
//   return result.rows;
// }

// export async function deleteLikeByCommentId(commentId: string, userId: string) {
//   const result = await pool.query(
//     'DELETE from likes WHERE comment_id = $1 and user_id = $2 RETURNING *',
//     [commentId, userId]
//   );
//   return result.rows;
// }
export async function getLikesByCommentId(commentId: string) {
  const { data, error } = await supabase
    .rpc('get_likes_by_comment_id', { comment_id: commentId });

  if (error) {
    console.error('Error from Supabase RPC:', error);
    throw error;
  }

  return data;
}

export async function checkLikeAlreadyExist(userId: string, postId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .eq('post_id', postId)

  if (error) {
    console.error('Error checking post like:', error)
    throw error
  }

  return data
}
export async function checkCommentLikeAlreadyExist(userId: string, commentId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .eq('comment_id', commentId)

  if (error) {
    console.error('Error checking comment like:', error)
    throw error
  }

  return data
}

export async function createLike(userId: string, postId: string | null, commentId: string | null) {
  const { data, error } = await supabase
    .from('likes')
    .insert([
      {
        user_id: userId,
        post_id: postId,
        comment_id: commentId
      }
    ])
    .select() // Return inserted row
    .single() // optional if you only expect one

  if (error && error.code !== '23505') { // 23505 = unique violation
    console.error('Error creating like:', error)
    throw error
  }

  return data ? [data] : []
}
export async function deleteLike(likeId: string, userId: string) {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .eq('id', likeId)
    .eq('user_id', userId)
    .select() // Return deleted row(s)

  if (error) {
    console.error('Error deleting like:', error)
    throw error
  }

  return data
}

export async function deleteLikeByPostId(postId: string, userId: string) {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId)
    .select()

  if (error) {
    console.error('Error deleting like by postId:', error)
    throw error
  }

  return data
}


export async function deleteLikeByCommentId(commentId: string, userId: string) {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .select()

  if (error) {
    console.error('Error deleting like by commentId:', error)
    throw error
  }

  return data
}

export async function getCommentLikesByUserId(userId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select('comment_id')
    .eq('user_id', userId)
    .not('comment_id', 'is', null) // exclude post likes

  if (error) {
    console.error('Error getting comment likes:', error)
    throw error
  }

  return data
}
