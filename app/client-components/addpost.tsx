"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@nextui-org/react";
import { ClipLoader } from "react-spinners";

export default function AddPost() {

    const { data: session } = useSession()
    const [note, setNote] = useState<string>('')
    const [isLoading, setIsloading] = useState<boolean>(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isLoading) return;
        setIsloading(true);

        if(note.length < 1) {
            setIsloading(false);
            return;
        }
        if(note.length > 500) {
            setIsloading(false);
            return;
        }
        else {
            try{
                const res = await fetch("/api/addPost", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                        content: note,
                    })
                })
                if (res.ok) {
                    setNote("");
                    router.refresh();
                  }
                } 
            finally {
                setIsloading(false) 
            }
        }
    }  
    return (
        //Use form when adding records to database
        <Card className="AddItem">
            <form onSubmit={handleSubmit} noValidate style={{height: '150px', display: 'flex', alignItems: 'center' }}>
                <div style={{width: '460px'}}>
                    <textarea className="input"
                        required
                        onChange={(e) => setNote(e.target.value)}
                        value={note}
                        style={{ resize: 'none', height: '150px', width: '450px', marginRight: '10px', border: 'solid'}}
                        placeholder={!session ? "Please sign in to post" : ""}
                    />
                </div>
                <div style={{width: '150px', marginLeft: '10px'}}>
                    <button
                        className="btn-primary"
                        disabled={!session || isLoading}
                        type="submit"
                        style={{border: 'solid', borderRadius: '10px', background: 'white', padding: '4px 10px', maxWidth: '86 px', minWidth: '86 px', maxHeight: '60px', minHeight: '60px', marginBottom: '20px'}}
                    >
                        {isLoading && <ClipLoader/>}
                        {!isLoading && <span>Add Post</span>}
                    </button>
                    {note.length < 501 ? <span>{note.length}</span> : <span style={{color: 'red'}}>{note.length}</span>}/500
                </div>
            </form>
        </Card>
    )
}