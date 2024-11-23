import dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.port || 4000;

app.use(express.json());



// Create a new post
app.post('/posts', async (req: Request, res: Response) => {
  const { title, content } = req.body;
  try{
    const post = await prisma.post.create({
      data: {
        title, 
        content,
      },
    });
    res.json(post);
  }catch(err:any){
    console.log(err.message)
  }
});


// Get all posts
app.get('/posts', async (req: Request, res: Response) => {
  try{
    const posts = await prisma.post.findMany();
    res.json(posts);
  }catch(err:any){
    console.log(err.message)
  }
});

app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'Database connected' });
  } catch (err) {
    res.status(500).json({ status: 'Database connection failed', error: err });
  }
});

// Get a single post
app.get('/posts/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });
  res.json(post);
});

// Update a post
app.put('/posts/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      title,
      content,
    },
  });
  res.json(post);
});

// Delete a post
app.delete('/posts/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.post.delete({
    where: { id: Number(id) },
  });
  res.json({ message: 'Post deleted successfully' });
});




app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});