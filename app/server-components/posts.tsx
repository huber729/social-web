"use client"
import { Likes, Subscribe} from "@prisma/client";
import AddPost from "../client-components/addpost";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { DateTime } from "next-auth/providers/kakao";
import Filter from "../client-components/postFilter";
import { useSession } from "next-auth/react";

export default function Feed({
  posts,
  subscriberEmail,
}: {
  posts: {
    id: number;
    note: string; 
    author: {
      id: number;
      email: string;
      name: string;
      subscribedTo: Subscribe[];
    } 
    likes: Likes[];
    likesCount: number;
    createdAt: DateTime;
  }[]; 

  subscriberEmail: {
    id: number;
    email: string;
  }[];
})
{
  const [feed, setFeed] = useState("Feed")
  const [filter, setFilter] = useState("Newest")
  const session = useSession()

  const updateFeed = (value: string) => {
    setFeed(value);
  };

  const timeStamp = posts.map((item) => 
    Date.parse(item.createdAt)
    )

  const currentTimeStamp = Date.now()
  const timeDifferences = posts.map((item) => {
    const postTimeStamp = Date.parse(item.createdAt);
    const timeDifferenceInMilliseconds = currentTimeStamp - postTimeStamp;
    
    // Convert the time difference to the desired format (e.g., minutes, hours, days, etc.)
    const timeDifferenceInSeconds = Math.floor(timeDifferenceInMilliseconds / (1000));
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
    const timeDifferenceInHours = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60));
    const timeDifferenceInDays = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));
    const timeDifferenceInWeeks = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24 * 7))
    
    if(timeDifferenceInMilliseconds < 60000)
      {
        return(`${timeDifferenceInSeconds} Seconds Ago`)
      }
    if(timeDifferenceInMilliseconds < 3600000)
      {
        return(`${timeDifferenceInMinutes} Minutes Ago`)
      }
    if(timeDifferenceInMilliseconds < 86400000)
      {
        return(`${timeDifferenceInHours} Hours Ago`)
      }
    if(timeDifferenceInMilliseconds < 604800000)
      {
        return(`${timeDifferenceInDays} Days Ago`)
      }
    if(timeDifferenceInMilliseconds > 604799999)
      {
        return(`${timeDifferenceInWeeks} Weeks Ago`)
      }
    else
      {
        return null
      }
  });
    
  const newdata = posts.map((item, index) => ({
    ...item,
    timeStamp: timeStamp[index],
    timeDifferences: timeDifferences[index],      
  }));
  let sort;
  switch(filter) {
    case "Most Liked":
      sort = newdata.sort((a, b) => {
        if (b.likesCount === a.likesCount) {
          // If the number of likes is the same, sort by timestamp in descending order
          return b.timeStamp - a.timeStamp;
        }
          // Sort by likesCount in descending order
          return b.likesCount - a.likesCount;
      });
      break;
    case("Oldest"):
      sort = newdata.sort((a,b) => a.timeStamp - b.timeStamp)
      break;
      case("Newest"):
        sort = newdata.sort((a,b) => b.timeStamp - a.timeStamp)
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '20px' }}>
      <div style={{ display: 'flex', gap: '300px' }}>
        {session.status === "authenticated" ? (feed === "Following" ? <Button onClick={() => updateFeed("Following")} style={{ outline: 'none', fontWeight: 'bold' }}>Following</Button> :
        <Button onClick={() => updateFeed("Following")} style={{ outline: 'none'}}>Following</Button>) : null}
        {feed === "Feed" ? <Button onClick={() => updateFeed("Feed")} style={{ outline: 'none', fontWeight: 'bold' }}>Feed</Button> :
        <Button onClick={() => updateFeed("Feed")} style={{ outline: 'none'}}>Feed</Button>}
        {session.status === "authenticated" ? (feed === "Liked" ? <Button onClick={() => updateFeed("Liked")} style={{ outline: 'none', fontWeight: 'bold' }}>Liked</Button> :
        <Button onClick={() => updateFeed("Liked")} style={{ outline: 'none'}}>Liked</Button>) : null}
      </div>
      <div style={{marginTop: '20px'}}>
        {feed === "Feed" && session.status === "authenticated" ? <AddPost/> : null}
      </div>
      <div style={{marginTop: '10px'}}>
        <Filter newdata={newdata} page={feed} subscriberEmail={subscriberEmail}/> 
      </div>
    </div>
  );
}