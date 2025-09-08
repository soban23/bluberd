"use client";

import dynamic from "next/dynamic";

import { useParams } from "next/navigation";

const Messages = dynamic(() => import("@/components/directMessages"), {});

export default function Home() {
  const { conversationId } = useParams();

  const conversationIdStr = String(conversationId);

  return (
    <div className="">
      <Messages conversationId={conversationIdStr}></Messages>
    </div>
  );
}
