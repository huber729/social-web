"use client"
import { useRouter } from "next/navigation"
import { MdKeyboardBackspace } from "react-icons/md";

export default function GoBack() {   
    const router = useRouter();
    
    const back = () =>{
        router.back()
    }

    return(
        <div>
            <button onClick={back} style={{ fontSize: '44px' }}><MdKeyboardBackspace/></button>
        </div>
    )
}