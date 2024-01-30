"use client"

import { signOut } from 'next-auth/react'

export default function SignOut() {
    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <button style={{marginLeft: '10px'}} onClick={handleSignOut}>
            Sign Out
        </button>       
    )
}