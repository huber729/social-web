import authOptions from './options'; // Update the path accordingly
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }