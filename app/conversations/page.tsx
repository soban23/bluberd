import dynamic from "next/dynamic";

const Conversations = dynamic(() => import("@/components/conversations"), {});

export default function Home() {
  return (
    <div className="">
      <Conversations></Conversations>
    </div>
  );
}
