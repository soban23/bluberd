//TL of posts divided into 2 tabs of following and explore


import dynamic from 'next/dynamic';


const Conversations = dynamic(() => import('@/components/conversations'), {
  loading: () => <p>Loading conversations...</p>,
});


export default function Home() {

    return(
        <div className=''>

            <Conversations></Conversations>
            {/* <div className="">----------------------</div>
            <PopularPosts></PopularPosts> */}
        
        </div>
    )

}