// 'use client';

// import { useState } from 'react';

// import { signIn, signOut, useSession } from 'next-auth/react'
// interface CreatePostModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {

//       const { data: session, status } = useSession()
//   const [content, setContent] = useState('');
//   const [postImg, setPostImg] = useState<String | null>(null);
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = async () => {
//     setLoading(true);
//     console.log('postimg', postImg)
//     try {
//       const res = await fetch('/api/posts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ content, image:postImg }),
//       });

//       if (!res.ok) {
//         throw new Error('Failed to create post');
//       }
//       setPostImg(null)
//       setContent('');
//       onClose(); // close modal on success
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };


// const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   setLoading(true);
//   const file = e.target.files?.[0];
//   if (!file || !session?.user?.id) return;

//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('userId', session.user.id);
//   formData.append('folder', 'post-images');


//   const res = await fetch('/api/upload', {
//     method: 'POST',
//      body: formData, 
//   });


//   const data = await res.json();

//     console.log('data for url:', data);
//   if (res.ok) {
//     console.log('Uploaded:', data.url);

//     setPostImg(data.url)
//     // optionally call your update user API with new `pfp` url
//   } else {
//     console.error('Upload failed:', data.error);
//   }
//   setLoading(false);
// };

//   return (
//     <div onClick={onClose}>
//       <div onClick={(e) => e.stopPropagation()}>
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           rows={4}
//         />
//         <div>

//           <button onClick={onClose} disabled={loading}>--Cancel--</button>
//           <button onClick={handleSubmit} disabled={loading || !content.trim()}>
//              --Create--
//             {loading ? 'Posting...' : 'Post'}
//           </button>
//           {typeof postImg === 'string' && <div><img src={postImg} alt="post-img" width={300} /></div>}

//         <input type="file" accept="image/*" onChange={handleFileChange} />
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
// import { FaPlus } from 'react-icons/fa';
import Spinner from '@/src/components/ui/chat/spinner'
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>()
  const [imgFile, setImgFile] = useState<File | null>(null)

  if (!isOpen) return null;

  const uploadToSupabase = async () => {
    if (!imgFile || !session?.user?.id) return;

    const formData = new FormData();
    formData.append('file', imgFile);
    formData.append('userId', session.user.id);
    formData.append('folder', 'post-images');


    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });


    const data = await res.json();

    console.log('data for url:', data);
    if (res.ok) {
      console.log('Uploaded:', data.url);


      return data.url;
    } else {

      console.error('Upload failed:', data.error);
      throw new Error;
    }
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {


      let uploadedUrl = null;
      if (imgFile) {
        uploadedUrl = await uploadToSupabase();
      } else {
        console.log('no imgfile')
      }
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, image: uploadedUrl }),
      });

      if (!res.ok) throw new Error('Failed to create post');

      setImgFile(null)
      setPreviewUrl(null)

      setContent('');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      alert('Post Created!')
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    setLoading(true);
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      alert("Please select a valid image file.");
      setPreviewUrl(null)
      setImgFile(null)
      setLoading(false)
      return;
    }


    setPreviewUrl(URL.createObjectURL(file));
    setImgFile(file);





    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-lg shadow-lg p-6 relative border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Create Post</h2>

        {previewUrl && (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full rounded-md object-cover max-h-[400px]"
            />
          </div>
        )}

        <textarea
          className="w-full p-3 border rounded-md resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          placeholder="What's on your mind?"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex items-center justify-between">
          {/* Upload Button */}
          <label className="cursor-pointer flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            <div>+</div>
            <span>Add Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => {
                onClose();
                setPreviewUrl(null);
                setImgFile(null);
                setContent('');
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800"
            >
              {loading ? <Spinner></Spinner> : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}
