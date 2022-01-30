import { Link, useLoaderData } from "remix";
import { fetchQuery } from "~/utils/graphql.server";

export const loader = async () => {
  return await fetchQuery({
    query: `query PostsQuery {
      posts {
        title
        slug
        publishDate
      }
    }`
  }).then(r => r.posts)

}

export default function Index() {
  const posts = useLoaderData()

  return (
    <div>
      <h1>My blog</h1>
      <h2>Posts</h2>
      {posts && (
        <ul>
          {posts.map(post => (
            <li><Link to={`/posts/${post.slug}`}>{post.title}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
