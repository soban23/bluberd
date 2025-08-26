import { getFollowingsByUserId,deleteFollows,createFollowing } from '@/lib/db/follows';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';


export const GET = async (req: Request, context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch follows', { status: 401 });
        }
        
       const {userId} = await context.params;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }
       
        
        

        const followings = await getFollowingsByUserId(userId);
        return Response.json(followings, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error getting followings', { status: 500 })
    }


};


export const DELETE = async (req: Request, context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch follows', { status: 401 });
        }
        const {userId} = await context.params;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }
       
        
        

        const followings = await deleteFollows( userId,String(session?.user?.id))
        return Response.json(followings, { status: 200 });
    } catch (error) {
        console.error('delete Error:', error)
        return new Response('Error deleting followings', { status: 500 })
    }


};



export const POST = async (req: Request, context:any) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to fetch follows', { status: 401 });
        }
        
        const {userId} = await context.params;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }
       
        
        

        const followings = await createFollowing(userId, String(session?.user?.id))
        return Response.json(followings, { status: 200 });
    } catch (error) {
        console.error('post Error:', error)
        return new Response('post create followings', { status: 500 })
    }


};


