import Feed from "../server-components/posts";
import { Likes,Subscribe } from "@prisma/client";
import { DateTime } from "next-auth/providers/kakao";

async function getPosts() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/getPosts`,{
    cache: "no-store"
  })
  return res.json();
}

async function getProfile() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/getProfile`,{
    cache: "no-store"
  })
  return res.json();
}  

export default async function Posts() {
  const data: {
    id: number;
    note: string;
    author: {
      id: number;
      name: string;
      email: string;
      subscribedTo: Subscribe[];
    }
    likes: Likes[];
    createdAt: DateTime;
  }[] = await getPosts();

  const data2: {
    id: number;
    email: string;
  }[] = await getProfile();

  const likes = data.map((item) => 
    Object.keys(item.likes).length  
  )
    
  const newdata = data.map((item, index) => ({
    ...item,
    likesCount: likes[index], 
  }));

  return (
    <main>
      <Feed posts={newdata} subscriberEmail={data2}/>
    </main>
  );
}
