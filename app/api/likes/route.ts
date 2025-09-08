import { createLike, checkLikeAlreadyExist } from "@/lib/db/likes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("signin to like", { status: 401 });
    }
    const { postId, commentId } = await req.json();
    const userId = session.user.id;

    if (!userId) {
      return new Response("Missing user ID", { status: 400 });
    }
    if (!postId && !commentId) {
      return new Response("like for which comment or post?", { status: 400 });
    }

    const like = await createLike(userId, postId, commentId);
    return Response.json(like, { status: 200 });
  } catch (error) {
    console.error("create Error:", error);
    return new Response("Error creating like", { status: 500 });
  }
};
