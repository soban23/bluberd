// //TL of posts divided into 2 tabs of following and explore


// import dynamic from 'next/dynamic';


// const FollowingPosts = dynamic(() => import('@/components/followingPosts'), {
//   loading: () => <p>Loading follwoing posts...</p>,
// });
// const PopularPosts = dynamic(() => import('@/components/popularPosts'), {
//   loading: () => <p>Loading popularPosts...</p>,
// });

// export default function Home() {

//     return(
//         <div className='border border-solid'>
//            <FollowingPosts typeOfPosts={'popular'}></FollowingPosts>

//             <FollowingPosts typeOfPosts={'following'}></FollowingPosts>
//             {/* <div className="">----------------------</div>
//             <PopularPosts></PopularPosts> */}
        
//         </div>
//     )

// }

'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';

const FollowingPosts = dynamic(() => import('@/components/followingPosts'), {
  // loading: () => <p>Loading following posts...</p>,
});
const PopularPosts = dynamic(() => import('@/components/popularPosts'), {
  // loading: () => <p>Loading popular posts...</p>,
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'following' | 'popular'>('popular');

  return (
    <div className="max-w-xl mx-auto px-4 mt-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-2">
        <button
          onClick={() => setActiveTab('popular')}
          className={`w-1/2 text-center py-2 font-medium transition-colors ${
            activeTab === 'popular'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          Popular
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`w-1/2 text-center py-2 font-medium transition-colors ${
            activeTab === 'following'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          Following
        </button>
        
      </div>

      {/* Content */}
      <div>
        <div className={activeTab === 'popular' ? 'block' : 'hidden'}>
          <FollowingPosts typeOfPosts="popular" />
        </div>
        <div className={activeTab === 'following' ? 'block' : 'hidden'}>
          <FollowingPosts typeOfPosts="following" />
        </div>
        
      </div>
    </div>
  );
}
