"use client";

import { useState, useEffect, FormEvent } from "react";

type posts = {
  postid: string;
  authorname: string;
  authorusername: string;
  authorpfp: string;
  content: string;
  contentimage: string;
  numberoflikes: number;
  numberofcomments: number;
};

export default function PopularPosts() {
  const [posts, setPosts] = useState<posts[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPopularPosts();
  }, []);

  const fetchPopularPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/");
      const data = await res.json();
      setPosts(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
      console.log(posts);
    }
  };

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
  );
}
