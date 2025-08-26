import {deleteComment, updateComment, getCommentByCommentId } from '@/lib/db/comments';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';


export const GET = async (req: Request, context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch comments', { status: 401 });
        }
        
        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }

        const {commentId} = await context.params;

        if (!commentId) {
            return new Response('Missing comment ID', { status: 400 });
        }
       
        
        

        const comment = await getCommentByCommentId(commentId);
        return Response.json(comment, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error fetching comments', { status: 500 })
    }


};

export const DELETE = async (req: Request,context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch comments', { status: 401 });
        }
        
        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }

        const {commentId} = await context.params;

        if (!commentId) {
            return new Response('Missing comment ID', { status: 400 });
        }
       
        
        

        const comment = await deleteComment(commentId, userId);
        return Response.json(comment, { status: 200 });
    } catch (error) {
        console.error('delete Error:', error)
        return new Response('Error deleting comments', { status: 500 })
    }


};

export const PUT = async (req: Request, context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch comments', { status: 401 });
        }
        
        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }

        const {commentId} = await context.params;

        if (!commentId) {
            return new Response('Missing comment ID', { status: 400 });
        }
       
        const {content} = await req.json();

        if (!content) {
            return new Response('Missing content', { status: 400 });
        }
        

        const comment = await updateComment(content, commentId, userId);
        return Response.json(comment, { status: 200 });
    } catch (error) {
        console.error('updating Error:', error)
        return new Response('Error updating comments', { status: 500 })
    }


};

