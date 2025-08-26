// 'use client'

// import { useState, useEffect, FormEvent } from 'react'
// import dynamic from 'next/dynamic';
// import {  useSession } from 'next-auth/react'

// const LikesModal = dynamic(() => import('@/components/likesModal'), {
//     loading: () => <p>Loading follwoing posts...</p>,
// });

// type Comment = {
//     commentid: string
//     authorname: string
//     authorusername: string
//     authorpfp: string
//     content: string
//     numberoflikes: number
//     numberofcomments: number

// }
// interface CommentProps {
//     postId?: string;
//     //refreshTrigger: number;
//      newContent: string | null;
//     onConsume: () => void;

//     //   onClose: () => void;
// }

// export default function ShowComments({ postId, newContent ,onConsume }: CommentProps) {
//     //   const [name, setName] = useState('')
//     //   const [email, setEmail] = useState('')
//     const { data: session } = useSession()
//     const [comments, setComments] = useState<Comment[]>([])
//     const [loading, setLoading] = useState(false)
//     const [showLikesModal, setShowLikesModal] = useState(false);
//     const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
//     const handleLikesClick = (commentId: string) => {
//         setSelectedCommentId(commentId);
//         setShowLikesModal(true);
//     };
//     //useeffect loading..default next
//     useEffect(() => {

//         if (newContent) {
//       const newComment: Comment = {
//         commentid: crypto.randomUUID(), // or generate with backend
//         authorname: String(session?.user.name),
//         authorusername: String(session?.user.name),
//         authorpfp: '',
//         content: newContent,
//         numberoflikes: 0,
//         numberofcomments: 0,
//       };

//       setComments((prev) => [newComment, ...prev]);
//       onConsume(); // reset newContent in parent
//     }

//     }, [newContent])

//     useEffect(()=>{
//         fetchComments();
//     },[])

//     const fetchComments = async () => {
//         setLoading(true); // 🟡 Start loading
//         try {
//             const res = await fetch(`/api/posts/${postId}/comments/`);
//             const data = await res.json();
//             setComments(data);
//             console.log(data);
//         } catch (error) {
//             console.error('Failed to fetch comments', error);
//         } finally {
//             setLoading(false); // 🟢 Done loading
//             console.log(comments);

//         }

//     }

//     // commentshandleSubmit = async (e: FormEvent) => {
//     //     e.preventDefault()
//     //     setLoading(true)

//     //     const res = await fetch('/api/students', {
//     //       method: 'comment',
//     //       headers: { 'Content-Type': 'application/json' },
//     //       body: JSON.stringify({ name, email }),
//     //     })

//     //     if (res.ok) {
//     //       setName('')
//     //       setEmail('')
//     //     //   fetchStudents()
//     //     }

//     //     setLoading(false)
//     //   }

//     const handleAddComment = async () => {
//         const newComment: Comment = {
//             commentid: 'new123',
//             authorname: 'Alice',
//             authorusername: '@alice',
//             authorpfp: '/pfp/alice.png',
//             content: 'This is a new comment!',
//             numberoflikes: 0,
//             numberofcomments: 0,
//         };

//         // 🟢 Put new comment at index 0
//         setComments((prev) => [newComment, ...prev]);
//     };


//     return (

//         <div>
//             {loading ? (
//                 <div>Loading comments...</div>
//             ) : (
//                 <div className='bg-red-500'>
//                     {comments.map((comment) => (
//                         <div key={comment.commentid}>

//                             <div className="">{comment.authorname}</div>
//                             <div className="">{comment.content}</div>

//                             <div className="" >comments: {comment.numberoflikes}</div>
//                             <div className="" onClick={() => handleLikesClick(comment.commentid)}>likes: {comment.numberoflikes}</div>
//                             {showLikesModal && (selectedCommentId == comment.commentid) && (
//                                 <LikesModal
//                                     commentId={selectedCommentId}
//                                     onClose={() => setShowLikesModal(false)}
//                                 ></LikesModal>)}
//                             <br />

//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }



