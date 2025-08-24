import { checkCommentLikeAlreadyExist } from '@/lib/db/likes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';


export const GET = async (req: Request, context:{params:{commentId: string}}) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch like', { status: 401 });
        }

        const userId = String(session.user.id);
        
        const {commentId} = await context.params;
        //const commentId = null;
        if (!commentId) {
            return new Response('Missing comment ID', { status: 400 });
        }
       

        

        const likes = await checkCommentLikeAlreadyExist(userId, commentId);
        console.log('data like ka:',likes.length,likes)
        return Response.json(likes, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error getting likes', { status: 500 })
    }


};

