// import pool from '@/lib/db'

// //  id | image | content | author_id | created_at



// export async function getPostsByUserId(userId: string) {
//   const result = await pool.query(`
//     SELECT
//   p.id AS postId,
//   u.name AS authorName,
//   u.username AS authorUsername,
//   u.pfp AS authorPfp,
//   p.content AS content,
//   p.image AS contentImage,
//   COUNT(DISTINCT l.id) AS numberOfLikes,
//   COUNT(DISTINCT c.id) AS numberOfComments
// FROM posts p 
// JOIN users u ON u.id = p.author_id
// LEFT JOIN likes l ON l.post_id = p.id
// LEFT JOIN comments c ON c.post_id = p.id
// WHERE u.id = $1
// GROUP BY p.id, u.name, u.username, u.pfp, p.content, p.image
// ;

//     `, [userId]);
//   return result.rows;
// }

// export async function getPostsByPostId(postId: string, userId: string) {
//   const result = await pool.query(`
//     SELECT
//   p.id AS postId,
//   u.name AS authorName,
//   u.username AS authorUsername,
//   u.pfp AS authorPfp,
//   p.content AS content,
//   p.image AS contentImage,
//   COUNT(DISTINCT l.id) AS numberOfLikes,
//   COUNT(DISTINCT c.id) AS numberOfComments
// FROM posts p 
// JOIN users u ON u.id = p.author_id
// LEFT JOIN likes l ON l.post_id = p.id
// LEFT JOIN comments c ON c.post_id = p.id
// WHERE p.id = $1
// GROUP BY p.id, u.name, u.username, u.pfp, p.content, p.image
// ;

//     `, [postId]);
//   return result.rows[0];
// }

// export async function getPostsOfFollowings1(userId: string) {
//   const result = await pool.query(
//     `
//     SELECT
//   p.id AS postId,
//   u.name AS authorName,
//   u.username AS authorUsername,
//   u.pfp AS authorPfp,
//   p.content,
//   p.image AS contentImage,
//   COUNT(DISTINCT l.id) AS numberOfLikes,
//   COUNT(DISTINCT c.id) AS numberOfComments
// FROM follows f
// JOIN posts p ON f.user_id = p.author_id
// JOIN users u ON u.id = p.author_id
// LEFT JOIN likes l ON l.post_id = p.id
// LEFT JOIN comments c ON c.post_id = p.id
// WHERE f.follower_id = $1
// GROUP BY 
//   p.id,
//   u.name,
//   u.username,
//   u.pfp,
//   p.content,
//   p.image
// ORDER BY p.created_at DESC;

//     `,
//     [userId]
//   );
//   return result.rows;
// }

// export async function getPopularPosts() {
//   const result = await pool.query(
//     `
//     SELECT
//   p.id AS postId,
//   u.name AS authorName,
//   u.username AS authorUsername,
//   u.pfp AS authorPfp,
//   p.content,
//   p.image AS contentImage,
//   COUNT(DISTINCT l.id) AS numberOfLikes,
//   COUNT(DISTINCT c.id) AS numberOfComments
// FROM posts p 
// JOIN users u ON u.id = p.author_id
// LEFT JOIN likes l ON l.post_id = p.id
// LEFT JOIN comments c ON c.post_id = p.id
// GROUP BY 
//   p.id,
//   u.name,
//   u.username,
//   u.pfp,
//   p.content,
//   p.image
// ORDER BY COUNT(DISTINCT l.id) DESC;

//     `
    
//   );
//   return result.rows;
// }

// export async function checkAuthorSameAsUser(postId: string, userId: string) {
//   const result = await pool.query('SELECT * FROM posts WHERE id = $1 and author_id = $2', [postId, userId]);
//   return result.rows;
// }

// export async function createPost(authorId: string, content: string, image: Buffer) {
//   const result = await pool.query(
//     'INSERT INTO posts (author_id, content, image) VALUES ($1, $2, $3) RETURNING *',
//     [authorId, content, image]
//   )
//   return result.rows;
// }

// export async function updatePost(postId: string, content: string, image: Buffer) {
//   const result = await pool.query(
//     'UPDATE posts SET content = $1, image = $2 WHERE id = $3 RETURNING *',
//     [content, image, postId]
//   );
//   return result.rows;
// }

// export async function deletePost(postId: string) {
//   const result = await pool.query(
//     'DELETE from posts WHERE id = $1 RETURNING *',
//     [postId]
//   );
//   return result.rows;
// }


import { supabase } from '@/lib/supabaseClient'

// 1. Posts by user
export async function getPostsByUserId(userId: string) {
  const { data, error } = await supabase
    .rpc('get_posts_by_user_id', { author_id: userId })
  if (error) throw error
  return data
}

// 2. Single post by ID
export async function getPostByPostId(postId: string) {
  const { data, error } = await supabase
    .rpc('get_post_by_id', { post_id: postId })
  if (error) throw error
  return data?.[0] ?? null
}

// 3. Following feed
export async function getPostsOfFollowings(userId: string) {
  const { data, error } = await supabase
    .rpc('get_posts_of_followings', { user_id: userId })
  if (error) throw error
  return data
}

// 4. Trending/popular posts
export async function getPopularPosts() {
  const { data, error } = await supabase.rpc('get_popular_posts')
  if (error) throw error
  return data
}

// 5. Author verification
export async function checkAuthorSameAsUser(postId: string, userId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('author_id', userId)
  if (error) throw error
  return data
}

// 6. Create a post
export async function createPost(authorId: string, content: string, image: string) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ author_id: authorId, content, image })
    .select()
  if (error) throw error
  return data
}

// 7. Update a post
export async function updatePost(postId: string, content: string, image: string) {
  const { data, error } = await supabase
    .from('posts')
    .update({ content, image })
    .eq('id', postId)
    .select()
  if (error) throw error
  return data
}

// 8. Delete a post
export async function deletePost(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .select()
  if (error) throw error
  return data
}
