'use client'

import { useState, useEffect, FormEvent } from 'react'

type posts = {
  postid: string
  authorname: string
  authorusername: string
  authorpfp: string
  content: string
  contentimage: string
  numberoflikes: number
  numberofcomments: number

}

export default function PopularPosts() {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
  const [posts, setPosts] = useState<posts[]>([])
  const [loading, setLoading] = useState(false)
//useeffect loading..default next
  useEffect(() => {
    
     fetchPopularPosts()
     
  }, [])

  const fetchPopularPosts = async () => {
    setLoading(true); // 🟡 Start loading
  try {
    const res = await fetch('/api/posts/');
    const data = await res.json();
    setPosts(data);
    console.log(data);
  } catch (error) {
    console.error('Failed to fetch posts', error);
  } finally {
    setLoading(false); // 🟢 Done loading
    console.log(posts);

  }
    
  }

// postshandleSubmit = async (e: FormEvent) => {
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

  return (
    
    <div>
  {loading ? (
    <div>Loading posts...</div>
  ) : (
    <div>
      {posts.map((post) => (
        <div key={post.postid}>
            
          <p>{post.content}</p>
          <p>{post.authorname}</p>
        </div>
      ))}
    </div>
  )}
</div>
  )
}



