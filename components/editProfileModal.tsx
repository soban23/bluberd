'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: {
        userid: string;
        name: string;
        username: string;
        bio?: string;
        pfp: string;
    
    };
    onSave: (updatedUser: { name: string; username: string; bio?: string; pfp?: string }) => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onSave }: Props) {
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState(user.pfp);
    const [loading, setLoading] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        setName(user.name);
        setUsername(user.username);
        setBio(user.bio || '');
        setPreviewURL(user.pfp);
        console.log('userid param useeffect',user)
    }, [isOpen, user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setLoading(true)
        let pfpUrl = user.pfp;

        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('userId', user.userid);
            formData.append('folder', 'avatars');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                pfpUrl = data.url;
            } else {
                console.error('Image upload failed:', data.error);
                return;
            }
        }
        console.log('userid param bfore',user)
        console.log('user chng vals',name,username,bio)
        await updateUser(name, username, bio, pfpUrl, user.userid);
        
        setLoading(false)
        onClose();
    };
    const updateUser = async (name: string, username: string, bio: string, pfp: string, userId:string) => {
        if (!user) return;
        //const userId=user.id;
        console.log('yuserid',userId)

        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    name: name,
                    pfp: pfp,
                    bio: bio,
                }),
            });

            const data = await res.json();
            if(res.ok){
                onSave({name, username, bio, pfp})
            }     
            console.log('User updated:', data);
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    if (!isOpen) return null;

   return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-md">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-xl relative">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
        Edit Profile
      </h2>

      {/* Avatar with "+" button overlay */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        <Image
          src={previewURL}
          alt="Avatar Preview"
          width={100}
          height={100}
          className="rounded-full object-cover w-full h-full"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-700"
          title="Change avatar"
        >
          +
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Form */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded mt-1 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded mt-1 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded mt-1 dark:bg-gray-800 dark:text-white"
            rows={3}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  </div>
);


}
