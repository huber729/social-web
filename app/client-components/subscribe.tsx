"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { Posts, Subscribe } from "@prisma/client";
import { ClipLoader } from "react-spinners";


export default function Subscribed(
  {id} : {id: number}) {
    const { data: session } = useSession();
    const { user } = session || {};   
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error creating post.");
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
      setError(false);
    } catch (error) {

      setErrorMessage("Error subscribing to User.");
      setError(true);
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
          {!loading ? <>Follow</> : <ClipLoader/>}
        </Button>
    )
}