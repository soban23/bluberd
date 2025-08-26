import {getCommentsByPostId, createComment } from '@/lib/db/comments';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';




export const GET = async (req: Request, context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch comments', { status: 401 });
        }
        const {postId} = await context.params;

        if (!postId ) {
            return new Response('postId missing', { status: 401 });
        }
        
        
       
        
        

        const comments = await getCommentsByPostId(postId);
        return Response.json(comments, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error getting comments', { status: 500 })
    }


};





export const POST = async (req: Request, context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to post comments', { status: 401 });
        }
        
        const userId = session.user.id;


        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        
        }

        const {content, postId, commenter_lead} = await req.json();
        
        // if(!commenter_lead){
        //     commenter_lead=null;
        // }
       
         
        

        const comment = await createComment(content, postId, userId, commenter_lead);
        return Response.json(comment, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error creating comments', { status: 500 })
    }


};

