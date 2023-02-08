// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

// Fake Data
import { Post } from "interfaces/posts";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | null>
) {
  const postIdFromQuery = req.query?.id;
  if (postIdFromQuery) {
    const postId = parseInt(
      Array.isArray(postIdFromQuery) ? postIdFromQuery?.[0] : postIdFromQuery
    );
    if (req.method === "DELETE") {
      await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      // Accepted
      res.status(202).json(await prisma.post.findMany());
    }

    if (req.method === "PUT") {
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title: req.body.title,
          description: req.body.description,
        },
      });
      // Accepted
      res.status(202).json(await prisma.post.findMany());
    }
  } else {
    // Unsupported
    res.status(415).json(null);
  }
}
