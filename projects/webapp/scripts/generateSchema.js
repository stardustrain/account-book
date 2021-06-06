const fs = require('fs')
const path = require('path')
const fetch = require('isomorphic-fetch')
const { getIntrospectionQuery, buildClientSchema, printSchema } = require('graphql')

const generateSchema = async () => {
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getIntrospectionQuery(),
      }),
    })

    const res = await response.json()
    const sdl = printSchema(buildClientSchema(res.data))
    const parentPath = path.join(__dirname, '../')
    fs.writeFileSync(`${parentPath}/schema.graphql`, sdl)
  } catch (e) {
    console.error(e)
  }
}

generateSchema()
