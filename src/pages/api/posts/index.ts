// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

// Fake Data
import { Post } from "interfaces/posts";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[]>
) {

  if (req.method === "POST") {
    await prisma.post.create({
      data: {
        title: req.body.title,
        description: req.body.description,
      },
    });
  }
  const posts = await prisma.post.findMany();
  res.json(posts);
}
