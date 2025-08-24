import { getPostsOfFollowings } from '@/lib/db/posts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { supabase } from '@/lib/supabaseClient'

export const GET = async (req: Request) => {
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response('signin to follow', { status: 401 });
        }

        const userId = session.user.id;

        if (!userId) {
            return new Response('Missing user ID', { status: 400 });
        }

        const { data, error } = await supabase
            .rpc('get_posts_of_followings', { follower_id: userId })

        if (error) {
            console.error('Error fetching posts of followings:', error)
            throw error
        }

       

        //const posts = await getPostsOfFollowings(userId);
        return Response.json(data, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error fetching followings posts', { status: 500 })
    }


};


