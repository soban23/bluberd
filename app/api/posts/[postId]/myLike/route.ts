import { checkLikeAlreadyExist } from '@/lib/db/likes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';


export const GET = async (req: Request, context:{params:{postId: string}}) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch like', { status: 401 });
        }

        const userId = String(session.user.id);
        
        const {postId} = await context.params;
        const commentId = null;
        if (!postId) {
            return new Response('Missing post ID', { status: 400 });
        }
       

        

        const likes = await checkLikeAlreadyExist(userId, postId);
        console.log('data like ka:',likes.length,likes)
        return Response.json(likes, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error getting likes', { status: 500 })
    }


};

