import { Link, useLoaderData } from "remix";
import { fetchQuery } from "~/utils/graphql.server";

export const loader = async () => {
  return await fetchQuery({
    query: `query PostsQuery {
      posts(
        where: {status: {
          equals: published
        }},
        orderBy: {
          publishDate: desc
        }
      ) {
        id
        title
        slug
        publishDate
      }
    }`
  }).then(r => r.posts)

}

export const headers = () => {
  return {
      'Cache-Control': 's-maxage=300'
  }
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
            <li key={post.id}><Link to={`/posts/${post.slug}`}>{post.title}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
