"use client"
import { signIn } from 'next-auth/react'

export default function LogIn() {
    const handleSignIn = async () => {
        await signIn('google', { callbackUrl: "http://localhost:3000/feed" });
    };

    return (
        <li className="list-none">
            <button onClick={handleSignIn}>
                Sign In
            </button>
        </li>   
    )
}