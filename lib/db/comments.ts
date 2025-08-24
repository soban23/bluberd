// import pool from '@/lib/db'       

// //  id | content | post_id | author_id | commenter_lead | created_at



// export async function getCommentsByAuthorId(authorId: string) {
//   const result = await pool.query(`
//     SELECT
//   c.id AS commentId,
//   u.name AS authorName,
//   u.username AS authorUsername,
//   u.pfp AS authorPfp,
//   c.content AS content,
//   COUNT(DISTINCT l.id) AS numberOfLikes,
//   COUNT(DISTINCT co.commenter_lead) AS numberOfComments
// FROM comments c
// JOIN posts p ON p.id = c.post_id 
// JOIN users u ON u.id = c.author_id
// LEFT JOIN likes l ON l.comment_id = c.id
// LEFT JOIN comments co ON c.id = co.commenter_lead
// WHERE c.author_id = $1
// GROUP BY c.id, u.name, u.username, u.pfp, c.content
// ;

//     `, [authorId]);
//   return result.rows;
// }

// export async function getCommentsByPostId(postId: string) {
//   const result = await pool.query(`
//     SELECT
//   c.id AS commentId,
//   u.name AS authorName,
//   u.username AS authorUsername,
//   u.pfp AS authorPfp,
//   c.content AS content,
//   COUNT(DISTINCT l.id) AS numberOfLikes,
//   COUNT(DISTINCT co.commenter_lead) AS numberOfComments
// FROM comments c
// JOIN posts p ON p.id = c.post_id 
// JOIN users u ON u.id = c.author_id
// LEFT JOIN likes l ON l.comment_id = c.id
// LEFT JOIN comments co ON c.id = co.commenter_lead
// WHERE p.id = $1
// GROUP BY c.id, u.name, u.username, u.pfp, c.content
// ;

//     `, [postId]);
//   return result.rows;
// }


// export async function getCommentByCommentId(commentId: string) {
//   const result = await pool.query(`
//     SELECT
//   c.id AS commentId,
//   u.name AS authorName,
//   u.username AS authorUsername,
//   u.pfp AS authorPfp,
//   c.content AS content,
//   COUNT(DISTINCT l.id) AS numberOfLikes,
//   COUNT(DISTINCT co.commenter_lead) AS numberOfComments
// FROM comments c 
// JOIN users u ON u.id = c.author_id
// LEFT JOIN likes l ON l.comment_id = c.id
// LEFT JOIN comments co ON c.id = co.commenter_lead
// WHERE c.id = $1
// GROUP BY c.id, u.name, u.username, u.pfp, c.content
// ;

//     `, [commentId]);
//   return result.rows[0];
// }

// //
// export async function getCommentsOfCommentLead(commentLead: string) {
//   const result = await pool.query(`
//     SELECT
//   c.id AS commentId,
//   u.name AS authorName,
//   u.username AS authorUsername,
//   u.pfp AS authorPfp,
//   c.content AS content,
//   COUNT(DISTINCT l.id) AS numberOfLikes,
//   COUNT(DISTINCT co.commenter_lead) AS numberOfComments
// FROM comments c 
// JOIN users u ON u.id = c.author_id
// LEFT JOIN likes l ON l.comment_id = c.id
// LEFT JOIN comments co ON c.id = co.commenter_lead
// WHERE c.commenter_lead = $1
// GROUP BY c.id, u.name, u.username, u.pfp, c.content
// ;

//     `, [commentLead]);
//   return result.rows;
// }

// export async function createComment(content: string, postId: string, authorId: string, commentLead: string ) {
//   const result = await pool.query(
//         'INSERT INTO comments (author_id, content, commenter_lead, post_id) VALUES ($1, $2, $3, $4) RETURNING *',
//         [authorId, content, commentLead, postId]
//       )
//   return result.rows;
// }

// export async function updateComment(content: string, commentId: string, userId:string) {
//   const result = await pool.query(
//     'UPDATE comments SET content = $1 WHERE id = $2 and author_id = $3 RETURNING *',
//     [content, commentId, userId ]
//   );
//   return result.rows;
// }

// export async function deleteComment(commentId: string, userId:string) {
//   const result = await pool.query(
//     'DELETE from comments WHERE id = $1 and author_id = $2 RETURNING *',
//     [commentId, userId]
//   );
//   return result.rows;
// }
import { supabase } from '@/lib/supabaseClient'

// 🔁 Rewritten: Get comments by author
export async function getCommentsByAuthorId(authorId: string) {
  const { data, error } = await supabase
    .rpc('get_comments_by_author_id', { author_id: authorId });

  if (error) throw error;
  return data;
}

// 🔁 Rewritten: Get comments by post
export async function getCommentsByPostId(postId: string) {
  const { data, error } = await supabase
    .rpc('get_comments_by_post_id', { post_id: postId });

  if (error) throw error;
  return data;
}

// 🔁 Rewritten: Get single comment
export async function getCommentByCommentId(commentId: string) {
  const { data, error } = await supabase
    .rpc('get_comment_by_id', { comment_id: commentId });

  if (error) throw error;
  return data?.[0]; // Only one row expected
}

// 🔁 Rewritten: Replies to a comment
export async function getCommentsOfCommentLead(commentLead: string) {
  const { data, error } = await supabase
    .rpc('get_comments_by_comment_lead', { lead_id: commentLead });

  if (error) throw error;
  return data;
}

export async function createComment(content: string, postId: string, authorId: string, commentLead: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      content,
      post_id: postId,
      author_id: authorId,
      commenter_lead: commentLead
    })
    .select()

  if (error) throw error;
  return data;
}

export async function updateComment(content: string, commentId: string, userId: string) {
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .eq('author_id', userId)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: string, userId: string) {
  const { data, error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('author_id', userId)
    .select();

  if (error) throw error;
  return data;
}
