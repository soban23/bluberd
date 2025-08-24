'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
    id: string;
    name: string;
    username: string;
    pfp?: string;
}

// interface UserSearchProps {
//   users: User[]; // You pass this list in from a parent or fetch it client-side
// }

export default function SearchUser() {
    const [query, setQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const [users, setUsers] = useState<User[]>([]);
    useEffect(()=>{
         fetchUsers();
    },[])
    useEffect(() => {

       

        if (query.trim() === '') {
            setFilteredUsers([]);
        } else {
            const lower = query.toLowerCase();
            setFilteredUsers(
                users.filter(
                    user =>
                        user.name.toLowerCase().includes(lower) ||
                        user.username.toLowerCase().includes(lower)
                )
            );
        }
    }, [query, users]);

    const fetchUsers = async () => {

        //setLoading(true); // 🟡 Start loading
        try {
            const res = await fetch('/api/users/');
            const data = await res.json();
            setUsers(data);
            console.log(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            //setLoading(false); // 🟢 Done loading
            //console.log(posts);

        }


    }

   return (
  <div className="relative w-full max-w-md mx-auto mt-6">
    <input
      type="text"
      placeholder="Search users..."
      className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />

    {filteredUsers.length > 0 && (
      <div className="absolute z-10 w-full bg-white dark:bg-gray-900 shadow-lg mt-2 rounded-md max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700">
        {filteredUsers.map(user => (
          <Link
            key={user.id}
            href={`/profile/${user.id}`}
            className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <img
              src={
                user.pfp ??
                'https://ecpwdbjgvnlmvcbwburq.supabase.co/storage/v1/object/public/avatars/pfp.png'
              }
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm text-black dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
);

}
