import { graphql, fetchQuery } from 'react-relay'
import { initEnvironment } from '../relay/relayEnvironment'

const query = graphql`
  query pages_index_CategoryList_Query($limit: Int) {
    categoryList(limit: $limit) {
      title
      categoryType
    }
  }
`

export const getStaticProps = async () => {
  const environment = initEnvironment()
  try {
    const queryProps = await fetchQuery<any>(environment, query, {
      limit: 10,
    }).toPromise()

    const initialRecords = environment.getStore().getSource().toJSON()

    return {
      props: {
        ...queryProps,
        initialRecords,
      },
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

export default function Home() {
  return <div></div>
}
