import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "../../../../lib/prisma"

export const authOptions: NextAuthOptions = {
    session: {
      strategy: 'jwt'
    },
    
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // ...add more providers here
      ],
    
    callbacks: {
      async signIn({ account, profile }) {
        if (!profile?.email) {
          throw new Error('No profile')
        }

      await prisma.user.upsert({
        where: {
          email: profile.email,
        },
        create: {
          email: profile.email,
          name: profile.name,
        },
        update: {
          name: profile.name,
        }
      })
      return true
      }
    }
  }    

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }