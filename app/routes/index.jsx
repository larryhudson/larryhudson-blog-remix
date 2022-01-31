import { Link, useLoaderData, json } from "remix";
import { fetchQuery } from "~/utils/graphql.server";
import { DateTime } from "luxon";
import { isoToNiceDate } from "~/utils/date";

export const loader = async () => {
  const postsData = await fetchQuery({
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
    }`,
  }).then((r) => r.posts);

  return json(postsData, {
    headers: {
      "Cache-Control": "s-maxage=86400",
    },
  });
};

export const headers = () => {
  return {
    "Cache-Control": "s-maxage=86400",
  };
};

function PostItem({ post }) {
  return (
    <div>
      <h3 style={{ marginBottom: `0.5rem` }}>
        <Link to={`/posts/${post.slug}`}>{post.title}</Link>
      </h3>
      <small>{isoToNiceDate(post.publishDate)}</small>
    </div>
  );
}

export default function Index() {
  const posts = useLoaderData();

  return (
    <div>
      <h1>Larry Hudson</h1>
      <h2>Posts</h2>
      {posts && (
        <section>
          {posts.map((post) => (
            <PostItem post={post} key={post.id} />
          ))}
        </section>
      )}
    </div>
  );
}
