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
      .json({ message: "Please sign in to create a post." });
  } 
  const { user } = session;
  const { content } = req.body;
  // Get user from database
  const prismaUser = await prisma.user.findUnique({
    where: { email: session?.user?.email || undefined },
  });

  // Create post
  try {
    const result = await prisma.posts.create({
      data: {
        note: content as string,
        authorId: prismaUser?.id as number
      },
    });

    return res.json(result);
  } catch (err) {
    res.status(402).json({ err: "Error has occured while making a post" });
  }
}