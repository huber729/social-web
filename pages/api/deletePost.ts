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
      .json({ message: "Please sign in to delete a post." });
  }

  const { user } = session;
  const { postId } = req.body;

  try {
    const post = await prisma.posts.findUnique({
      where: { id: postId as number },
      select: { authorId: true },
    });
    const poster = await prisma.user.findUnique({
        where: { email: user?.email as string},
        select: { id: true},
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (post.authorId !== poster?.id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const result = await prisma.posts.delete({
      where: {
        id: postId as number,
      },
    });

    return res.json(result);
  } catch (err) {
    res.status(402).json({ err: "Error has occured while deleting a post" });
  }
}