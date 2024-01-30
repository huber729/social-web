"use client";

import React, { useState } from "react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Likes, Subscribe } from "@prisma/client";
import { Button, Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { BsHandThumbsUp } from "react-icons/bs";
import { useEffect } from "react";
import Delete from "./deletepost";
import Subscribed from "./subscribe";
import UnSubscribe from "./unsubscribe";
import { ClipLoader } from "react-spinners";

export default function Post({
  //Items that need to be passed into function 
  id,
  note,
  name,
  email,
  likesCount,
  authorId,
  following,
  subscriberEmail,
  page,
  likes,
  timeDifferences,
}: {
  id: number;
  note: string;
  name: string | null;
  email: string;
  likesCount: number | null;
  authorId: number;
  following: Subscribe[] | null;
  subscriberEmail: {
    id: number;
    email: string;
  }[] | null;
  page: string | null;
  likes: Likes[] | null;
  timeDifferences: string | null;
}) {
  //Hooks
  const { data: session } = useSession();
  const { user } = session || {};
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);

  //Slows down rendering of time differences to avoid error of server side and client side not matching
  const [renderTimeDifferences, setRenderTimeDifferences] = useState(false);

  useEffect(() => {
    // Introduce a delay before rendering time differences on the client side
    const timeout = setTimeout(() => {
      setRenderTimeDifferences(true);
    }, 1000); // Adjust the delay duration as needed (in milliseconds)

    return () => clearTimeout(timeout); // Cleanup on component unmount
  }, []); // Run the effect only once on mount
  //Test

  const profile = async (profileId: number) => {
    setLoading(true);
    try {
      router.push(`/profile/${profileId}`)
    }
    finally {
      setLoading(false);
    }
  }

  const likePost = async (postId: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/addLikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: postId
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } 
    finally {
      setLoading(false);
    }
  }; 

  //Finds the user that is logged in and looks at each post and sees if the post is by an author the user is subscribed to 
  const matchingSubscriber = subscriberEmail ? subscriberEmail.find((subscriber) => subscriber.email === user?.email) : null;
  const isSubscribed = following ? following.find((item) => item.subscriberId === matchingSubscriber?.id) : null;
  const matchingSubscriberLikes = subscriberEmail ? subscriberEmail.find((subscriber) => subscriber.email === user?.email) : null;
  const hasLiked = likes ? likes.find((item) => item.authorId === matchingSubscriberLikes?.id) : null;
  //sets the content for the page based on what tab the user clicks on
  let content;
  switch (page) {
    case "Following":
      if(isSubscribed !== undefined) {
        content = (
          <div>
            <Card 
              style={{ backgroundColor: 'lightgray', border: 'solid', borderRadius: '30px', maxWidth: '600px'}}         
            >
              <div style={{ maxWidth: '100%' }}>
                <CardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <div className="p-4" style={{wordWrap: 'break-word', width: '450px'}}>
                      <Button style={{outline: 'none'}} disabled={loading} onPress={() => profile(authorId)}>
                        {name}
                      </Button>
                    </div>
                    <div className="p-4" style={{wordWrap: 'break-word'}}>    
                      {email ? email === user?.email && session && <Delete id={id}/> : null}
                      {email ? email !== user?.email && isSubscribed !== undefined && session && <UnSubscribe id={authorId}/> : null}
                      {email ? email !== user?.email && isSubscribed === undefined && session && <Subscribed id={authorId}/> : null}
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="p-4" style={{wordWrap: 'break-word'}}>
                    {note}
                  </p>
                  {renderTimeDifferences && (
                    <p className="p-4" style={{ wordWrap: "break-word" }}>
                      {timeDifferences}
                    </p>
                  )}
                </CardBody>
                <CardFooter>
                  <div className="p-4" style={{wordWrap: 'break-word'}}>
                    {session ? (!loading ? <Button
                      disabled={loading}
                      onPress={() => likePost(id)}
                      style={{marginRight: "10px"}}>
                      {hasLiked !== undefined ? <BsHandThumbsUp color="Green"/> : <BsHandThumbsUp/>} 
                    </Button> : <ClipLoader/>) : (null)}
                    {likesCount} Likes 
                  </div>
                </CardFooter>
              </div>
            </Card>
            <br />
          </div>
        );
      }
      break;
    case "Liked":
      if(hasLiked !== undefined) {
        content = (
          <div>
            <Card
              style={{ backgroundColor: 'lightgray', border: 'solid', borderRadius: '30px', width: '600px'}}             
            >
              <div style={{ maxWidth: '100%' }}>
                <CardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <div className="p-4" style={{wordWrap: 'break-word', width: '450px'}}>
                      <Button disabled={loading} onPress={() => profile(authorId)}>
                        {name}
                      </Button>
                    </div>
                    <div className="p-4" style={{wordWrap: 'break-word'}}>    
                      {email ? email === user?.email && session && <Delete id={id}/> : null}
                      {email ? email !== user?.email && isSubscribed !== undefined && session && <UnSubscribe id={authorId}/> : null}
                      {email ? email !== user?.email && isSubscribed === undefined && session && <Subscribed id={authorId}/> : null}
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="p-4" style={{wordWrap: 'break-word'}}>
                    {note}
                  </div>
                  {renderTimeDifferences && (
                    <p className="p-4" style={{ wordWrap: "break-word" }}>
                      {timeDifferences}
                    </p>
                  )}
                </CardBody>
                <CardFooter>
                  <div className="p-4" style={{wordWrap: 'break-word'}}>
                    {session ? (!loading ? <Button
                      disabled={loading}
                      onPress={() => likePost(id)}
                      style={{marginRight: "10px"}}>
                      {hasLiked !== undefined ? <BsHandThumbsUp color="Green"/> : <BsHandThumbsUp/>} 
                    </Button> : <ClipLoader/>) : (null)}
                    {likesCount} Likes 
                  </div>
                </CardFooter>
              </div>
            </Card>
            <br/>
          </div>
        );
      }
      break;
    case "profile":
      content = (
        <div>
          <Card
            style={{ backgroundColor: 'lightgray', border: 'solid', borderRadius: '30px', width: '600px'}} 
          >
            <div style={{ maxWidth: '100%' }}>
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                  <div className="p-4" style={{wordWrap: 'break-word', width: '450px'}}>
                    {note}
                  </div>
                  <div className="p-4" style={{wordWrap: 'break-word', marginRight: '20px'}}>    
                    {email ? email === user?.email && session && <Delete id={id}/> : null}
                  </div>
                </div>
                {renderTimeDifferences && (
                  <p className="p-4" style={{ wordWrap: "break-word" }}>
                  {timeDifferences}
                  </p>
                )}
              </CardBody>
              <CardFooter>
                <div className="p-4" style={{wordWrap: 'break-word'}}>
                  {session ? (!loading ? <Button
                    disabled={loading}
                    onPress={() => likePost(id)}
                    style={{marginRight: "10px"}}>
                    {hasLiked !== undefined ? <BsHandThumbsUp color="Green"/> : <BsHandThumbsUp/>} 
                  </Button> : <ClipLoader/>) : (null)}
                  {likesCount} Likes 
                </div>
              </CardFooter>
            </div>
          </Card>
          <br/>
        </div>
      );
      break;
    case "Feed":
    // Render default content for "Feed" page
    default:
      content = (
        <div>
          <Card 
            style={{ backgroundColor: 'lightgray', border: 'solid', borderRadius: '30px', width: '600px'}}  
          >
            <div style={{ maxWidth: '100%' }}>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                  <div className="p-4" style={{wordWrap: 'break-word', width: '450px'}}>
                    <Button disabled={loading} onPress={() => profile(authorId)}>
                      {name ? name : null}
                    </Button>
                  </div>
                  <div className="p-4" style={{wordWrap: 'break-word'}}>    
                    {email ? email === user?.email && session && <Delete id={id}/> : null}
                    {email ? email !== user?.email && isSubscribed !== undefined && session && <UnSubscribe id={authorId}/> : null}
                    {email ? email !== user?.email && isSubscribed === undefined && session && <Subscribed id={authorId}/> : null}
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="p-4" style={{wordWrap: 'break-word'}}>
                  {note}
                </div>
                {renderTimeDifferences && (
                  <p className="p-4" style={{ wordWrap: "break-word" }}>
                  {timeDifferences}
                  </p>
                )}
              </CardBody>         
              <CardFooter>
                <div className="p-4" style={{wordWrap: 'break-word'}}>
                  {session ? (!loading ? <Button
                    disabled={loading}
                    onPress={() => likePost(id)}
                    style={{marginRight: "10px"}}>
                    {hasLiked !== undefined ? <BsHandThumbsUp color="Green"/> : <BsHandThumbsUp/>} 
                  </Button> : <ClipLoader/>) : (null)}
                  {likesCount} Likes 
                </div>
              </CardFooter>
            </div>
          </Card>
          <br/>
        </div>
      );
      break;
  }
  return ( 
    <div>
      {content}
    </div>
    )
}

