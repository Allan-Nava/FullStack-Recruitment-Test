// Containers
import Layout from "containers/layout";

// Interface
import { Post } from "interfaces/posts";

// Components
import Posts from "components/Posts/Posts";

export default function Home({ posts }: { posts: Post[] }) {
  return (
    <Layout>
      <Posts posts={posts} />
    </Layout>
  );
}

export const sortById = (posts: Post[]) => {
  return [...posts].sort((a, b) => b.id - a.id);
};
export const getStaticProps = async () => {
  const posts = await (await fetch("http://localhost:3000/api/posts")).json();

  return {
    props: {
      posts: sortById(posts),
    },
  };
};
