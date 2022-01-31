import { Link, useLoaderData, json } from "remix";
import { fetchQuery } from "~/utils/graphql.server";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { isoToNiceDate } from "~/utils/date";

export const loader = async ({ params }) => {
  const postData = await fetchQuery({
    query: `query PostsQuery($slug: String) {
            post(where: {
              slug: $slug
            }) {
              title
              content {
                  document
              }
              slug
              status
              publishDate
            }
          }`,
    variables: {
      slug: params.slug,
    },
  }).then((r) => r.post);

  if (postData === null || postData.status !== "published") {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json(postData, {
    // these headers are just for the 'loader' JSON data, that gets fetched when you do a JS navigate
    headers: {
      "Cache-Control": "s-maxage=86400",
    },
  });
};

// these headers are for the full page load
export const headers = () => {
  return {
    "Cache-Control": "s-maxage=86400",
  };
};

export const meta = ({ data }) => {
  return {
    title: `${data.title} – Larry Hudson`,
  };
};

export default function PostPage() {
  const post = useLoaderData();
  return (
    <div>
      <p>
        <Link to="/">Back to posts</Link>
      </p>
      <h1 style={{ marginBottom: `0.5rem` }}>{post.title}</h1>
      <small>{isoToNiceDate(post.publishDate)}</small>
      <DocumentRenderer document={post.content.document} />
    </div>
  );
}
