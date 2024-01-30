import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {  
  try {
    const data = await prisma.user.findMany({
      include: {
        subscriber: true, 
        posts: true,
        subscribedTo: true,
      },
    });
    return res.status(200).json(data);
  } catch (error) {
    res.status(403).json({ err: "Error has occured while fetching posts" })
  }
}