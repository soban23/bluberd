'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EditProfileModal from '@/components/editProfileModal'
import Spinner from '@/src/components/ui/chat/spinner'
interface Props {
    userId: string;
}

type User = {
    id: string;
    name: string;
    username: string;
    pfp: string;
    bio?: string;
    numberoffollowers: number;
    numberoffollowing: number;
};

export default function Profile({ userId }: Props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);



    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [followed, setFollowed] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imgURL, setImgURL] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);

    const isMyProfile = userId === session?.user?.id;

    useEffect(() => {
        if (status === 'authenticated') {
            fetchUser();
            if (!isMyProfile) {
                checkFollowed();
            }
        }
    }, [status]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${userId}`);
            const data = await res.json();
            setUser(data);
            console.log("user-->", data)
        } catch (error) {
            console.error('Failed to fetch user', error);
        } finally {
            setLoading(false);
        }
    };

    const checkFollowed = async () => {
        try {
            const res = await fetch(`/api/followings/${userId}`);
            const data = await res.json();
            if (data[0]?.length !== 0) setFollowed(true);
        } catch (error) {
            console.error('Failed to check followings', error);
        }
    };

    const handleFollowToggle = async () => {
        const method = followed ? 'DELETE' : 'POST';

        try {
            const res = await fetch(`/api/users/${userId}/followings`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (res.ok) {
                setFollowed(!followed);
                setUser((prev) =>
                    prev
                        ? {
                            ...prev,
                            numberoffollowers: followed
                                ? prev.numberoffollowers - 1
                                : prev.numberoffollowers + 1,
                        }
                        : prev
                );
            }
        } catch (err) {
            console.error('Follow error:', err);
        }
    };

    const updateUserInParent = (data: Partial<User>) => {
        setUser((prev) => ({
            ...prev!,
            ...data, // overwrite fields like name, pfp, etc.
        }));
    }

    // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file || !session?.user?.id) return;

    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('userId', session.user.id);
    //     formData.append('folder', 'avatars');

    //     const res = await fetch('/api/upload', {
    //         method: 'POST',
    //         body: formData,
    //     });

    //     const data = await res.json();
    //     if (res.ok) {
    //         setImgURL(data.url);
    //         setUser((prev) =>
    //             prev
    //                 ? {
    //                     ...prev,
    //                     pfp: data.url,
    //                 }
    //                 : prev
    //         );
    //     }
    // };



    return (
  <div className="w-full max-w-xl mx-auto p-4 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 shadow-md">
    {loading ? (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    ) : (
      user && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <Image
              priority
              src={
                user.pfp ??
                "https://ecpwdbjgvnlmvcbwburq.supabase.co/storage/v1/object/public/avatars/pfp.png"
              }
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full object-cover w-[100px] h-[100px]"
            />
            <div>
              <div className="text-xl font-bold text-black dark:text-white">{user.name}</div>
              <div className="text-gray-600 dark:text-gray-400">@{user.username}</div>
            </div>
          </div>

          {user.bio && <div className="text-black dark:text-white">{user.bio}</div>}

          <div className="flex gap-6 text-sm mb-4 text-black dark:text-gray-300">
            <div>Followers: {user.numberoffollowers}</div>
            <div>Following: {user.numberoffollowing}</div>
          </div>

          {!isMyProfile ? (
            <div className="flex gap-3">
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-1 border text-sm rounded-full transition-colors
                  ${
                    followed
                      ? 'bg-gray-300 text-black dark:bg-gray-600 dark:text-white'
                      : 'bg-blue-500 text-white border-blue-300 hover:bg-blue-600'
                  }`}
              >
                {followed ? "Following" : "Follow"}
              </button>

              <button
                onClick={async () => {
                  console.log("userid", userId);
                  try {
                    const res = await fetch("/api/conversations", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ otherUserId: userId }),
                    });

                    const data = await res.json();

                    if (res.ok) {
                      return router.push(`/conversations/${data.id}`);
                    } else {
                      console.error("API error:", data);
                    }
                  } catch (error) {
                    console.error("Network or unexpected error:", error);
                  }
                }}
                className="px-4 py-1 border border-blue-300 text-sm rounded-full text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-800 transition-colors"
              >
                Message
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {!isModalOpen ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-1 border border-blue-300 text-sm rounded-full text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-800 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <EditProfileModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  user={{ userid: userId, ...user }}
                  onSave={(updatedData) => {
                    updateUserInParent(updatedData);
                  }}
                />
              )}
            </div>
          )}
        </>
      )
    )}
  </div>
);

}
