"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";

export default function Personal({id} : {id: number | null}) {

  const { data: session } = useSession();
  const { user } = session || {};
  const router = useRouter(); 

  const profile = async (id: number | null) => {
    try {
      router.push(`/profile/${id}`)
    }
    finally {
      null
    }
  }
  return(
    <Button style={{border: "none", outline: "none", marginRight: "10px"}} onPress={() => profile(id)}>
      {user?.name}
    </Button>
  )
    
}