import SignOut from "../client-components/signout";
import LogIn from "../client-components/login";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Personal from "../client-components/personal";

async function getProfile() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/getProfile`,{
    cache: "no-store"
  })
  return res.json();
}

export default async function Nav() {
  const data: {
    id: number
    email: string
  }[] = await getProfile()

  const session = await getServerSession(authOptions)

  const matchEmail = session ? data.find((sesh) => sesh.email === session.user?.email) : null
  const userId = matchEmail?.id? matchEmail.id : null

  return (
    <nav className="flex justify-end items-center py-2 lg:py-2 px-4 lg:px-8 bg-white text-black">
      {!session?.user && <LogIn />}
      <Personal id={userId}/>
      {session ? <>|</> : null}
      {session?.user && <SignOut/>}
    </nav>
  )
}