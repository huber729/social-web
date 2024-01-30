"use client";

import React, { useState } from "react"
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

export default function Delete({id} : {id: number}){

  const router = useRouter(); 
  const [loading, setLoading] = useState(false);

  const deletePost = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/deletePost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id }),
      });
      if (res.ok) {
        router.refresh();
      }
    }    
    finally {
      setLoading(false);
    }
  };
  return (
    <Button 
      disabled={loading} 
      color="danger" 
      onPress={() => deletePost(id)}
    >
      {!loading ? <FaTrashAlt color="red"/>: <ClipLoader/>}
    </Button>
  )
}
