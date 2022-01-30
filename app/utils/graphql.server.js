
import { request, gql } from 'graphql-request'

export const fetchQuery = ({query, variables}) => {
    return request(process.env.GRAPHQL_ENDPOINT, query, variables)
}