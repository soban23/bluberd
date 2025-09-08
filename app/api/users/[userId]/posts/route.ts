import { getPostsByUserId } from "@/lib/db/posts";

export const GET = async (req: Request, context: any) => {
  try {
    const { userId } = await context.params;

    if (!userId) {
      return new Response("Info not complete to fetch post", { status: 400 });
    }

    const post = await getPostsByUserId(userId);
    return Response.json(post, { status: 200 });
  } catch (error) {
    console.error("Get Error:", error);
    return new Response("Error fetching post", { status: 500 });
  }
};
