import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import authOptions from "@/app/api/auth/[...nextauth]/options"

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ message: "Please sign in to subscribe." });
  } 
  const { user } = session;
  const { content } = req.body;

  // Get user from database
  const prismaUser = await prisma.user.findUnique({
    where: { email: session?.user?.email || undefined },
  });

  //See if the user is already subscribed
  const alreadySubscribed = await prisma.subscribe.findFirst({
    where: {
      subscriberId: prismaUser?.id as number,
      subscribedToId: content as number,
      // subscriberId: content as number,
      // subscribedToId: prismaUser?.id as number,
    },
  });
  // Create post
  try {
    if (!alreadySubscribed) {
      // Create subscriber if user is not already subscribed
      const result = await prisma.subscribe.create({
        data: {
          subscriberId: prismaUser?.id as number,
          subscribedToId: content as number,
          // subscriberId: content as number,
          // subscribedToId: prismaUser?.id as number,
        },
      });

      return content && res.status(200).json(result);
    } else {
      // Delete subscriber if user is already subscribed
      const result = await prisma.subscribe.deleteMany({
        where: {
          subscriberId: prismaUser?.id as number,
          subscribedToId: content as number,
          // subscriberId: content as number,
          // subscribedToId: prismaUser?.id as number,
        },
      });
      return res.status(201).json(result);
    }
  } catch (err) {
    res
      .status(402)
      .json({ err: "Error has occured while trying to subscribe" });
  }
}