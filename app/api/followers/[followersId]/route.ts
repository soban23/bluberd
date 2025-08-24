import { deleteFollows } from '@/lib/db/follows';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';



//deleting followers
export const DELETE = async (req: Request, context:{params:{followersId: string}}) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to del follow', { status: 401 });
        }
        
        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }

        const {followersId} = await req.json();

        if (!followersId) {
            return new Response('Missing followers ID', { status: 400 });
        }
       
        

        const follows = await deleteFollows(userId, followersId);
        return Response.json(follows, { status: 200 });
    } catch (error) {
        console.error('delete Error:', error)
        return new Response('Error deleting follow', { status: 500 })
    }


};