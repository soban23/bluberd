import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import {
  getOrCreateConversation,
  listConversationsForUser,
} from "@/lib/db/conversations";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await listConversationsForUser(session.user.id);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { otherUserId } = await req.json();
  console.log("otheruserid", otherUserId);
  if (!otherUserId)
    return NextResponse.json({ error: "Missing otherUserId" }, { status: 400 });

  const conv = await getOrCreateConversation(session.user.id, otherUserId);
  return NextResponse.json(conv);
}
