import { getPostByPostId, updatePost, getPostsByUserId, checkAuthorSameAsUser, deletePost} from '@/lib/db/posts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';




export const GET = async (req: Request, context: { params: { postId: string } }) => {
    try {
        const { postId } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response('Unauthorized', { status: 403 });
        }
        if (!postId) {
            return new Response('Info not complete to fetch post', { status: 400 });
        }
        const userId = String(session.user.id);
        const post = await getPostByPostId(postId);
        return Response.json(post, { status: 200 });
    } catch (error) {
        console.error('Get Error:', error)
        return new Response('Error fetching post', { status: 500 })
    }


};

export const PUT = async (req: Request, context: { params: { postId: string } }) => {
    try {
        

        const { postId } = await context.params;

        const session = await getServerSession(authOptions);
        
        if (!session) {
            return new Response('Unauthorized', { status: 403 });
        }
        
        const { content, image  } = await req.json();



        if (!postId) {
            return new Response('postId not there to update post', { status: 400 });
        }
        if ( !content && !image) {
            return new Response('Info not complete to update post', { status: 400 });
        }

        const exist = await checkAuthorSameAsUser(postId, session.user.id as string);

        if (!exist) {
            return new Response('unauthorized', { status: 400 });

        }

        const post = await updatePost(postId, content, image);
        return Response.json(post, { status: 200 });
    } catch (error) {
        console.error('Put Error:', error)
        return new Response('Error updating post', { status: 500 })
    }


};

export const DELETE = async (req: Request, context: { params: { postId: string } }) => {
    try {
        const { postId } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response('Unauthorized', { status: 403 });
        }

        if (!postId) {
            return new Response('Info not complete to delete post', { status: 400 });
        }

        const exist = await checkAuthorSameAsUser(postId, session.user.id as string);

        if (!exist) {
            return new Response('unauthorized', { status: 400 });

        }


        const post = await deletePost(postId);

        return Response.json(post, { status: 200 });
    } catch (error) {
        console.error('Delete Error:', error)
        return new Response('Error deleting post', { status: 500 })
    }


};