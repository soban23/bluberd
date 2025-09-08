import { deleteLike } from "@/lib/db/likes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const DELETE = async (req: Request, context: any) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("signin to del like", { status: 401 });
    }
    const { likeId } = await context.params;
    const userId = session.user.id;

    if (!userId) {
      return new Response("Missing user ID", { status: 400 });
    }
    if (!likeId) {
      return new Response("likeId missing", { status: 400 });
    }

    const like = await deleteLike(likeId, userId);

    if (!like) {
      return new Response("no like found of this to delete", { status: 400 });
    }
    return Response.json(like, { status: 200 });
  } catch (error) {
    console.error("delete Error:", error);
    return new Response("Error deleting like", { status: 500 });
  }
};
