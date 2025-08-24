import { createFollowing, checkIfFollowExist, deleteFollows } from '@/lib/db/follows';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';


export const POST = async (req: Request, context:{params:{followingId: string}}) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to follow', { status: 401 });
        }
        
        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }

        const {followingId} = await context.params;

        if (!followingId) {
            return new Response('Missing follwoing ID', { status: 400 });
        }
       
        // const exist = await checkIfFollowExist( followingId, userId);
        
        // if (exist) {
        //     return new Response('already following', { status: 400 });
        // }

        const follows = await createFollowing(followingId,userId);
        return Response.json(follows, { status: 200 });
    } catch (error) {
        console.error('post Error:', error)
        return new Response('Error creating follow', { status: 500 })
    }


};

//deleting followings
export const DELETE = async (req: Request, context:{params:{followingId: string}}) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to follow', { status: 401 });
        }
        
        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }

        const {followingId} = await context.params;

        if (!followingId) {
            return new Response('Missing follwoing ID', { status: 400 });
        }
       
        

        const follows = await deleteFollows(followingId,userId);
        return Response.json(follows, { status: 200 });
    } catch (error) {
        console.error('delete Error:', error)
        return new Response('Error deleting follow', { status: 500 })
    }


};




export const GET = async (req: Request, context:{params:{followingId:string}})  => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to follow', { status: 401 });
        }
        
        const userId = String(session.user.id);

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }
        const {followingId} = await context.params;

        if (!followingId) {
            return new Response('Missing follwing ID', { status: 400 });
        }

        

        const user = await checkIfFollowExist(followingId,userId);
        return Response.json(user, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error fetching followings user', { status: 500 })
    }


};

