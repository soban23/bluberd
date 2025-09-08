import {
  getUserById,
  updateUser,
  deleteUser,
  checkUsernameExist,
} from "@/lib/db/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const GET = async (req: Request, context: any) => {
  try {
    const { userId } = await context.params;
    if (!userId) {
      return new Response("Info not complete to fetch user", { status: 400 });
    }

    const user = await getUserById(userId);
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Get Error:", error);
    return new Response("Error fetching user", { status: 500 });
  }
};

export const PUT = async (req: Request, context: any) => {
  try {
    const { userId } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session || session.user.id != userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { username, pfp, name, bio } = await req.json();

    if (!username || !pfp || !name) {
      return new Response("Info not complete to update user", { status: 400 });
    }

    const exist = await checkUsernameExist(username, userId);
    console.log("exist", exist);
    if (exist.length != 0) {
      return new Response("username already exists", { status: 400 });
    }

    const user = await updateUser(userId, username, pfp, name, bio);
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Put Error:", error);
    return new Response("Error updating user", { status: 500 });
  }
};

export const DELETE = async (req: Request, context: any) => {
  try {
    const { userId } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    if (!userId) {
      return new Response("Info not complete to delete user", { status: 400 });
    }

    const user = await deleteUser(userId);
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return new Response("Error deleting user", { status: 500 });
  }
};
