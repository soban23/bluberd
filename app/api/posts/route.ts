import { createPost, getPopularPosts } from '@/lib/db/posts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { log } from 'console';


export const POST = async (req: Request) => {
    try {

        const session = await getServerSession(authOptions);
        // console.log(session);
        // console.log(session?.user);
        // console.log(session?.expires);
        if (!session || !session.user?.id) {
            return new Response('Unauthorized', { status: 401 });
        }
        const {  content, image } = await req.json();
        const authorId = session.user.id;
        console.log('imgserver',image)

        if (!authorId) {
            return new Response('Missing author ID', { status: 400 });
        }
        if (!content && !image) {
            return new Response('Post must include content or an image', { status: 400 });
        }

        const user = await createPost(authorId, content, image);
        return Response.json(user, { status: 200 });
    } catch (error) {
        console.error('Insert Error:', error)
        return new Response('Error creating post', { status: 500 })
    }


};


export const GET = async (req: Request) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to see posts', { status: 401 });
        }
        
        

        

        const posts = await getPopularPosts();
        return Response.json(posts, { status: 200 });
    } catch (error) {
        console.error('get Error:', error)
        return new Response('Error fetching posts', { status: 500 })
    }


};

