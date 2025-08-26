//TL of posts divided into 2 tabs of following and explore
'use client';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
//refetch plus set component of commentbox for TLpage home
//make it a comp..n wrap
const ShowPost = dynamic(() => import('@/components/showPost'), {
  // loading: () => <p>Loading  post...</p>,
});
// const ShowComments = dynamic(() => import('@/components/showComments'), {
//   // loading: () => <p>Loading Comments...</p>,
// });
const CommentBox = dynamic(() => import('@/components/commentBox'), {
  // loading: () => <p>Loading...</p>,
});

const FollowingPosts = dynamic(() => import('@/components/followingPosts'), {
  // loading: () => <p>Loading...</p>,
});

type comments = {
    commentid: string
    authorname: string
    authorusername: string
    authorpfp: string
    content: string
    //contentimage: string
    numberoflikes: number
    numberofcomments: number

}

type commentData = {
    id: string
    author_id?:string
    commenter_lead?: string   
    content: string
    created_at?: String
    

}
export default function Comment()  {
     const {commentId} =  useParams();
     
      const commentIdStr = String(commentId);
     
    const [refreshTrigger, setRefreshTrigger] = useState(0);
     
  const [newCommentContent, setNewCommentContent] = useState<commentData | null>(null);

  useEffect(() => {
    if (newCommentContent !== null) {
      console.log('newcontent00',newCommentContent)
    setRefreshTrigger((prev) => prev + 1);
  }
    //setRefreshTrigger((prev) => prev + 1);

  }, [newCommentContent])
  // const refresh = () => {
  //   setRefreshTrigger((prev) => prev + 1);

  // };
    return(
        <div className=''>

            <ShowPost commentId={commentIdStr} refreshTrigger={refreshTrigger}></ShowPost>
            <CommentBox commentId={commentIdStr} onSubmitContent={(content) => setNewCommentContent(content)}></CommentBox>
            <FollowingPosts comment_id={commentIdStr} newContent={newCommentContent} onConsume={() => setNewCommentContent(null)}></FollowingPosts>
             
        </div>
    )

}