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
      .json({ message: "Please sign in to like." });
  } 
  const { user } = session;
  const { content } = req.body;

  // Get user from database
  const prismaUser = await prisma.user.findUnique({
    where: { email: session?.user?.email || undefined },
  });

  //See if the post is already liked
  const alreadyLiked = await prisma.likes.findFirst({
    where: {
      postId: content as number,
      authorId: prismaUser?.id as number,
    },
  });

  // Create post
  try {
    if (!alreadyLiked) {
      // Create like if user has not liked the post
      const result = await prisma.likes.create({
        data: {
          postId: content as number,
          authorId: prismaUser?.id as number,
        },
      });

      return res.status(200).json(result); 
    } else {
      // Delete like if user has already liked the post
      const result = await prisma.likes.delete({
        where: {
          id: alreadyLiked.id,
        },
      });
      return res.status(201).json(result);
    }
  } catch (err) {
    res
      .status(402)
      .json({ err: "Error has occured while trying to like post" });
  }
}