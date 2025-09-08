import { checkCommentLikeAlreadyExist } from "@/lib/db/likes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, context: any) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("signin to fetch like", { status: 401 });
    }

    const userId = String(session.user.id);

    const { commentId } = await context.params;

    if (!commentId) {
      return new Response("Missing comment ID", { status: 400 });
    }

    const likes = await checkCommentLikeAlreadyExist(userId, commentId);
    console.log("data like ka:", likes.length, likes);
    return Response.json(likes, { status: 200 });
  } catch (error) {
    console.error("get Error:", error);
    return new Response("Error getting likes", { status: 500 });
  }
};
