"use client";
import { useState } from "react";
import { Likes, Subscribe } from "@prisma/client";
import { DateTime } from "next-auth/providers/kakao";
import Post from "./post";
import { MdFilterAlt } from "react-icons/md";
import {Button, Listbox, ListboxItem} from "@nextui-org/react";

export default function Filter({
  newdata,
  page,
  subscriberEmail,
}: {
  newdata: {
    id: number;
    note: string; 
    author: {
      id: number; 
      email: string; 
      name: string;
      subscribedTo: Subscribe[] | null;
    }
    likes: Likes[] | null;
    likesCount: number;
    createdAt: DateTime; 
    timeStamp: number;
    timeDifferences: string | null;
  }[];
  page: string;
  subscriberEmail: {
    id: number;
    email: string;
  }[] | null,  
})
{
  const newdatapage = {
    newdata,
    page,
  };

  const [filter, setFilter] = useState("Newest")
  const [icon, setIcon] = useState(false)

  const toggleState = () => {
    setIcon((prevIsActive) => !prevIsActive);
    };

  const updateFilter = (value: string) => {
      setFilter(value); 
    };

  let sort;
  switch(filter) {
    case "Most Liked":
      sort = newdatapage.newdata.sort((a, b) => {
        if (b.likesCount === a.likesCount) {
          // If the number of likes is the same, sort by timestamp in descending order
          return b.timeStamp - a.timeStamp;
        }
        // Sort by likesCount in descending order
        return b.likesCount - a.likesCount;
      });
      break;
    case("Oldest"):
      sort = newdatapage.newdata.sort((a,b) => a.timeStamp - b.timeStamp)
      break;
    case("Newest"):
      sort = newdatapage.newdata.sort((a,b) => b.timeStamp - a.timeStamp)
  }

  return(
    <div>
      <Button onClick={toggleState} style={{ fontSize: '30px', marginRight: '500px', outline: 'none' }}><MdFilterAlt/></Button>
      {icon ? 
        <div className="flex flex-col gap-2">
          <Listbox className="ListboxItem">
            <ListboxItem key="liked" onClick={() => updateFilter("Most Liked")} style={{cursor: "pointer", outline: "none"}}>
              Most Liked {filter ==="Most Liked" && <span>&#10003;</span>}
            </ListboxItem>
            <ListboxItem key="newest" onClick={() => updateFilter("Newest")} style={{cursor: "pointer", outline: "none"}}>
              Newest {filter ==="Newest" && <span>&#10003;</span>}
            </ListboxItem>
            <ListboxItem key="oldest" onClick={() => updateFilter("Oldest")} style={{cursor: "pointer", outline: "none"}}>
              Oldest {filter ==="Oldest" && <span>&#10003;</span>}
            </ListboxItem>
          </Listbox>
        </div>
      : null}
      {sort?.map((post) => (
        <Post
          key={post.id}
          id={post.id} 
          note={post.note}
          name={post.author.name}
          email={post.author.email}
          likesCount={post.likesCount}
          authorId={post.author.id}
          following={post.author.subscribedTo}
          subscriberEmail={subscriberEmail}
          page={newdatapage.page}
          likes={post.likes}
          timeDifferences={post.timeDifferences}
        />
      ))}
    </div>
  )
}
