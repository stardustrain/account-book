import fetch from 'isomorphic-fetch'
import type { Variables } from 'relay-runtime'

const fetchGraphQL = async (query: string, variables: Variables) => {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  return await response.json()
}

export default fetchGraphQL
