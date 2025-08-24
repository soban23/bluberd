

'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';

const FollowingPosts = dynamic(() => import('@/components/followingPosts'), {
  loading: () => <p>Loading following posts...</p>,
});
const SearchUser = dynamic(() => import('@/components/searchUser'), {
//   loading: () => <p>Loading users...</p>,
});

export default function Search() {

  return (
    <div>
        <SearchUser></SearchUser>
    </div>
  );
}
