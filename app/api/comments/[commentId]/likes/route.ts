import { getLikesByCommentId } from '@/lib/db/likes';
import {  deleteLikeByCommentId } from '@/lib/db/likes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest } from 'next/server';


export const GET = async (req: NextRequest,context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch like', { status: 401 });
        }
        
        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }

        const {commentId} = await context.params;

        if (!commentId) {
            return new Response('Missing comment ID', { status: 400 });
        }
       
        
        

        const likes = await getLikesByCommentId(commentId);
        return Response.json(likes, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error getting likes', { status: 500 })
    }


};








export const DELETE = async (req: NextRequest,context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to del like', { status: 401 });
        }
        const { commentId } = await context.params;
        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }
        if (!commentId) {
            return new Response('likeId missing', { status: 400 });
        }

       

        

        const like = await deleteLikeByCommentId(commentId, userId);

        if(!like){
            return new Response('no like found of this to delete', { status: 400 });
        }
        return Response.json(like, { status: 200 });
    } catch (error) {
        console.error('delete Error:', error)
        return new Response('Error deleting like', { status: 500 })
    }


};




