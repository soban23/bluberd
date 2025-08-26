import { getFollowersByUserId, deleteFollows } from '@/lib/db/follows';
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
       
        
        

        const followers = await getFollowersByUserId(userId)
        return Response.json(followers, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error getting followers', { status: 500 })
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
       
        
        

        const followers = await deleteFollows( String(session?.user?.id),userId)
        return Response.json(followers, { status: 200 });
    } catch (error) {
        console.error('delete Error:', error)
        return new Response('Error deleting followers', { status: 500 })
    }


};
