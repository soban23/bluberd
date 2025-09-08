import { getUsers } from "@/lib/db/users";

export const GET = async (req: Request) => {
  try {
    const users = await getUsers();
    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error("Get Error:", error);
    return new Response("Error fetching user", { status: 500 });
  }
};
