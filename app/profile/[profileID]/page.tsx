import { Posts,Subscribe,Likes } from "@prisma/client";
import GoBack from "@/app/client-components/goback";
import { DateTime } from "next-auth/providers/kakao";
import Filter from "@/app/client-components/postFilter";
import { getServerSession } from "next-auth";
import Subscribed from "@/app/client-components/subscribe";
import { Card } from "@nextui-org/react";
import UnSubscribe from "@/app/client-components/unsubscribe";

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

export default async function ProfilePage({ params }: { params: { profileID: number } }) {
    const id = params.profileID
    const page = "profile" 
    const session = await getServerSession()
    
    const data: {
      id: number;
      note: string;
      author: {
        id: number;
        email: string;
        name: string;
        subscribedTo: Subscribe[];
      };
      likes:  Likes[];
      createdAt: DateTime;    
    }[] = await getPosts(); 
  
    const likes = data.map((item) => 
      Object.keys(item.likes).length 
    )

    const timeStamp = data.map((item) => 
      Date.parse(item.createdAt)
    )

    const currentTimeStamp = Date.now()
    
    const timeDifferences = data.map((item) => {
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

    const newdata = data.map((item, index) => ({
      ...item,
      likesCount: likes[index],
      timeStamp: timeStamp[index],
      timeDifferences: timeDifferences[index],
    })); 

    const filteredData = newdata.filter((item) => item.author.id == id);

    const data2 :{
      name: string;
      id: number;
      note: Posts;
      subscriber: Subscribe
      subscribedTo: Subscribe;
      email: string;
    }[] = await getProfile();

    //Check what accounts the user that is logged in is following
    const matchEmail = session ? data2.find((sesh) => sesh.email === session.user?.email) : null
    const subscribedToArray: Subscribe[] = data.flatMap((post) => post.author.subscribedTo);
    const final = subscribedToArray ? subscribedToArray.filter((item) => item.subscriberId === matchEmail?.id) : null  
    const followers = data2.map((item) => 
      Object.keys(item.subscribedTo).length
    ) 
    const userSubscribedTo = final?.map((item) => item.subscribedToId)
    //Return a boolean depending on if the account the user is viewing is followed or not
    const isUserSubscribed = (userSubscribedTo ?? []).includes(Number(params.profileID)) || false;

    const newdata2 = data2.map((item, index) => ({
      ...item,
      followersAmount: followers[index], 
    }));

    const filteredData2 = newdata2.filter((item) => item.id == id); 
    
  return(
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '20px' }}>
      <div>
        <GoBack/>
          {filteredData2.map((item) => (
            <Card className="Profile">
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div key={item.id}>
                  <p>{item.name}</p>
                  <p>{item.followersAmount} Followers</p>
                </div>
                {session ? isUserSubscribed && <UnSubscribe id = {id}/> : null}
                {session ? !isUserSubscribed && <Subscribed id = {id}/> : null} 
              </div>
            </Card>    
        ))}
      </div>
      <Filter newdata={filteredData} page={page} subscriberEmail={null}/>
    </div> 
  )
}