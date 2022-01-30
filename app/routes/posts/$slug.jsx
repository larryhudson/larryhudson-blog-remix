import { useLoaderData } from "remix"
import { fetchQuery } from "~/utils/graphql.server"
import { DocumentRenderer } from '@keystone-6/document-renderer';

export const loader = async ({params}) => {
    return await fetchQuery({
        query: `query PostsQuery($slug: String) {
            post(where: {
              slug: $slug
            }) {
              title
              content {
                  document
              }
              slug
              publishDate
            }
          }`,
          variables: {
              slug: params.slug
          }
    }).then(r => r.post)
}

export default function PostPage() {
    const post = useLoaderData()
    return <div>
        <h1>{post.title}</h1>
        <DocumentRenderer document={post.content.document} />
    </div>
}