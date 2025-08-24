//TL of posts divided into 2 tabs of following and explore
'use client'

import dynamic from 'next/dynamic';

    import { useParams } from 'next/navigation';

const Messages = dynamic(() => import('@/components/directMessages'), {
//   loading: () => <p>Loading Messages...</p>,
});


export default function Home() {
    
         const {conversationId} =  useParams();
         console
         const conversationIdStr = String(conversationId)
         
    console.log('conversationid--',conversationIdStr)
         
    return(
        <div className=''>

            <Messages conversationId={conversationIdStr}></Messages>
            {/* <div className="">----------------------</div>
            <PopularPosts></PopularPosts> */}
        
        </div>
    )

}