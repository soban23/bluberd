import { createLike, checkLikeAlreadyExist } from '@/lib/db/likes';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// type likedId ={
//     id:string
// }
export const POST = async (req: Request) => {
    try {

        const session = await getServerSession(authOptions);
        
        if (!session ) {
            return new Response('signin to like', { status: 401 });
        }
        const { postId, commentId } = await req.json();
        const userId = session.user.id;

        if (!userId) {
            console.log("1");
            return new Response('Missing user ID', { status: 400 });
            
        }
        if (!postId && !commentId) {
            console.log("2");
            return new Response('like for which comment or post?', { status: 400 });
        }
        console.log('comment:',commentId)
        // const exist = await checkLikeAlreadyExist(userId, postId);
        // // const likeid:likedId = exist;
        // // console.log('exist',exist)
        // if (exist.length!=0) {
        //     console.log("3");
        //     return new Response('like already there', { status: 400 });
        // }

        const like = await createLike(userId, postId, commentId);
        return Response.json(like, { status: 200 });
    } catch (error) {
        console.error('create Error:', error)
        return new Response('Error creating like', { status: 500 })
    }


};


// export const GET = async (req: Request) => {
//     try {

//         const session = await getServerSession(authOptions);
        
//         if (!session ) {
//             return new Response('signin to get likes info', { status: 401 });
//         }
       
//         const userId = session.user.id;

//         if (!userId) {
//             return new Response('Missing user ID', { status: 400 });
//         }
        

        

//         const likes = await getLikesByUserId(userId);
//         return Response.json(likes, { status: 200 });
//     } catch (error) {
//         console.error('create Error:', error)
//         return new Response('Error fetching likes', { status: 500 })
//     }


// };

