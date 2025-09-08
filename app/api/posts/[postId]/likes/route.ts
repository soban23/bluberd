import { deleteLikeByPostId } from "@/lib/db/likes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabaseClient";

export const GET = async (req: Request, context: any) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("signin to fetch like", { status: 401 });
    }

    const { postId } = await context.params;

    if (!postId) {
      return new Response("Missing post ID", { status: 400 });
    }

    const { data, error } = await supabase.rpc("get_likes_by_post_id", {
      post_id: postId,
    });

    if (error) {
      console.error("Error from RPC:", error);
      return new Response("Database error", { status: 500 });
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("get Error:", error);
    return new Response("Error getting likes", { status: 500 });
  }
};

export const DELETE = async (req: Request, context: any) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("signin to del like", { status: 401 });
    }
    const { postId } = await context.params;
    const userId = session.user.id;

    if (!userId) {
      return new Response("Missing user ID", { status: 400 });
    }
    if (!postId) {
      return new Response("likeId missing", { status: 400 });
    }

    const like = await deleteLikeByPostId(postId, userId);

    if (!like) {
      return new Response("no like found of this to delete", { status: 400 });
    }
    return Response.json(like, { status: 200 });
  } catch (error) {
    console.error("delete Error:", error);
    return new Response("Error deleting like", { status: 500 });
  }
};
