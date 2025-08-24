import {getCommentsByAuthorId } from '@/lib/db/comments';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';



export const GET = async (req: Request, context:{params:{userId: string}}) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch comments', { status: 401 });
        }
        
        const {userId} = await context.params;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }
       
        
        

        const comments = await getCommentsByAuthorId(userId);
        return Response.json(comments, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error getting comments', { status: 500 })
    }


};

