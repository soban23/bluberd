//TL of posts divided into 2 tabs of following and explore
'use client'

import dynamic from 'next/dynamic';

import { useParams } from 'next/navigation';

import { useState, useEffect, FormEvent } from 'react'

const Profile = dynamic(() => import('@/components/profile'), {
    // loading: () => <p>Loading follwoing posts...</p>,
});

const FollowingPosts = dynamic(() => import('@/components/followingPosts'), {
    // loading: () => <p>Loading follwoing posts...</p>,
});


const CreatePostModal = dynamic(() => import('@/components/createPostModal'), {
    // loading: () => <p>Loading create post...</p>,
});



export default function UserProfile() {
    const { userId } = useParams();


    const userIdStr = String(userId);
    const [showModal, setShowModal] = useState(false);
    const [postsParam, setPostParam] = useState<boolean>(true);

    const [commentsParam, setCommentsParam] = useState<boolean>(false);
    const handleTabs = async (tab: string) => {
        if (tab === "posts") {
            setPostParam(true)
            setCommentsParam(false)


        } else if (tab === "comments") {
            setPostParam(false)
            setCommentsParam(true)

        }


    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-6">
            {/* Profile */}
            <Profile userId={userIdStr} />

            {/* Create Post Button */}
            {/* <div className="my-4">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Create Post
                </button>
                <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
            </div> */}

            <div className="flex">
                <button
                    onClick={() => handleTabs("posts")}
                    className={`flex-1 py-2 text-center ${postsParam ? 'border-b-2 border-blue-500 font-semibold text-blue-600' : 'text-gray-500'
                        }`}
                >
                    Posts
                </button>

                <button
                    onClick={() => handleTabs("comments")}
                    className={`flex-1 py-2 text-center ${commentsParam ? 'border-b-2 border-blue-500 font-semibold text-blue-600' : 'text-gray-500'
                        }`}
                >
                    Comments
                </button>
            </div>

            {/* Posts or Comments */}
            <div style={{ display: postsParam ? "block" : "none" }}>
                <FollowingPosts forPost_user_id={userIdStr} />
            </div>

            <div style={{ display: commentsParam ? "block" : "none" }}>
                <FollowingPosts forComment_user_id={userIdStr} />
            </div>
        </div>

        // <div className=''>

        //     <Profile userId={userIdStr}></Profile>

        //     <div>

        //         <button onClick={() => setShowModal(true)}>Create Post</button>
        //         <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
        //     </div>
        //     <div>

        //         <button onClick={() => handleTabs("posts")}>posts    </button>
        //     </div>
        //     <div>

        //         <button onClick={() => handleTabs("comments")}>comments</button>
        //     </div>



        //     {/* {postsParam?(<div>
        //      <FollowingPosts key={'posts'} forPost_user_id={userIdStr} ></FollowingPosts>
        // </div>):(<div>
        //      <FollowingPosts key={'comments'} forComment_user_id={userIdStr}></FollowingPosts>
        // </div>)} */}

        //     <div style={{ display: postsParam ? 'block' : 'none' }}>
        //         <FollowingPosts forPost_user_id={userIdStr} />
        //     </div>
        //     <div style={{ display: commentsParam ? 'block' : 'none' }}>
        //         <FollowingPosts forComment_user_id={userIdStr} />

        //     </div>
        // </div>
    )

}
//ommsesnts not showing plus mt=y id shpow folow btn