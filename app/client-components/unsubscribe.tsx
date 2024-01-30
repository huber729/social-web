"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { ClipLoader } from "react-spinners";


export default function UnSubscribe({id} : {id: number}) {  
  const [loading, setLoading] = useState(false);
  const router = useRouter();
    
  const subscribe = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/addSubscribers", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ 
          content: Number(id)
        }), 
      });
      if (res.ok) {
        router.refresh();
      }
    } 
    finally {
    setLoading(false);
    }
  }
  return(
    <Button className="p-4"
      disabled={loading}
      style={{wordWrap: 'break-word', border: 'solid', borderRadius: '10px', background: 'white', padding: '4px 10px', width: '86 px', height: '40px', marginBottom: '20px'}}
      onPress={() => subscribe(id)}>
      {!loading ? <>Unfollow</> : <ClipLoader/>}
    </Button>
  )
}