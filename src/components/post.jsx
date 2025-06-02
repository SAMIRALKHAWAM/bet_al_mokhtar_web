import React, { useEffect, useState } from 'react'

const PostPage = () => {

const [post,setpost]=useState([]);


useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json())
    .then((data) => {
      setpost(data); 
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
},[])



  return (
    <div className="p-8">
    <ul className="space-y-4">
      {post.map((post) => (
        <li key={post.id} className="bg-white text-black p-4 rounded shadow">
          <p><strong>الاسم:</strong> {post.title}</p>
          <p><strong>الاسم:</strong> {post.body}</p>
        
        </li>
      ))}
    </ul>
  </div>
  )
}

export default PostPage
