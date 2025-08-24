import { getCommentLikesByUserId } from '@/lib/db/likes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';


export const GET = async (req: Request) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch like', { status: 401 });
        }
        
        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }
       
        // if(userId!= await context.params.userId){
        //     return new Response('unauthorized', { status: 400 });
        // }
        

        const likes = await getCommentLikesByUserId(userId);
        return Response.json(likes, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error getting likes', { status: 500 })
    }


};

