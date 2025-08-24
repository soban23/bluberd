'use client'

import { useState, useEffect, FormEvent } from 'react'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Separator } from "@/components/ui/separator"

import Spinner from '@/src/components/ui/chat/spinner'


type Conversation = {
    conversation_id: string,
    user1_id: string,
    name1: string,
    pfp1: string,
    user2_id: string,
    name2: string,
    pfp2: string,
    latestmessage: string,
    messagetime: string

}

export default function Conversations() {
    //   const [name, setName] = useState('')
    //   const [email, setEmail] = useState('')
    const router = useRouter();

    const { data: session, status } = useSession()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)
    //useeffect loading..default next
    useEffect(() => {

        fetchConversations()

    }, [])

    const fetchConversations = async () => {
        setLoading(true); // 🟡 Start loading
        try {
            const res = await fetch('/api/conversations/');
            const data = await res.json();
            setConversations(data);
            console.log(data);
        } catch (error) {
            console.error('Failed to fetch Conversations', error);
        } finally {
            setLoading(false); // 🟢 Done loading
            console.log(conversations);

        }

    }

    // ConversationshandleSubmit = async (e: FormEvent) => {
    //     e.preventDefault()
    //     setLoading(true)

    //     const res = await fetch('/api/students', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ name, email }),
    //     })

    //     if (res.ok) {
    //       setName('')
    //       setEmail('')
    //     //   fetchStudents()
    //     }

    //     setLoading(false)
    //   }
    const handleClick = (conversationId: String) => {

        router.push(`/conversations/${conversationId}`);




    };


    return (

        <div>
            {loading ? (
                <div className='flex items-center justify-center h-screen'><Spinner></Spinner></div>
            ) : (
                <div className='cursor-default lg:mx-[120px] xl:mx-[180px] 2xl:mx-[240px]  '>
                    
                    <div className='grid grid-cols-[1fr_3fr] gap-4 min-h-[48px] text-lg'><div className='flex items-center justify-center'><b>MESSAGES</b></div></div>
                    
                    <Separator></Separator>
                    
                        {conversations.map((convo) => (
                            <div key={convo.conversation_id} >
                                {convo.latestmessage &&
                                <div className='grid grid-cols-[1fr_3fr] gap-4 min-h-[96px]' >
                                    <div className='flex items-center justify-center w-full h-full'>
                                        {session?.user.id != convo.user1_id && <div>

                                            <Avatar onClick={()=>router.push(`profile/${convo.user1_id}`)}>
                                                <AvatarImage src={convo.pfp1} />
                                                <AvatarFallback>{convo.name1}</AvatarFallback>
                                            </Avatar>
                                        </div>}
                                        {session?.user.id != convo.user2_id && <div>

                                            <Avatar onClick={()=>router.push(`profile/${convo.user2_id}`)}>
                                                <AvatarImage src={convo.pfp2} />
                                                <AvatarFallback>{convo.name2}</AvatarFallback>
                                            </Avatar>
                                        </div>}
                                    </div>
                                    <div onClick={() => handleClick(convo.conversation_id)} className='flex flex-col justify-around'>
                                        {session?.user.id != convo.user1_id && <div>
                                            <b>{convo.name1}</b>

                                        </div>}
                                        {session?.user.id != convo.user2_id && <div>
                                            <b>{convo.name2}</b>

                                        </div>}
                                        <p className="truncate max-w-[320px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[640px] text-sm text-muted-foreground">
                                            {convo.latestmessage}
                                        </p>

                                        <span className="text-sm text-muted-foreground">
                                            {convo.messagetime && !isNaN(new Date(convo.messagetime).getTime()) ? (
                                                formatDistanceToNow(new Date(convo.messagetime), { addSuffix: true })
                                            ) : (
                                                "Invalid time"
                                            )}</span>


                                    </div>




                                    {/* <div>---------------------</div> */}
                                </div>

                                
                                }
                                {convo.latestmessage &&
                                    <Separator></Separator>
                                }
                            </div>

                        ))}
                    
                </div>
            )}
        </div>
    )
}



