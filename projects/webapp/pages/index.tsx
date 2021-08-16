import { graphql, fetchQuery, useLazyLoadQuery } from 'react-relay'
import { initEnvironment } from '../relay/relayEnvironment'
import { useState } from 'react'
import type { pages_index_CategoryList_Query } from '../__generated__/pages_index_CategoryList_Query.graphql'

import Modal from '../components/Modal'
import LayoutTemplate from '../components/LayoutTemplate'

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
    const queryProps = await fetchQuery<pages_index_CategoryList_Query>(environment, query, {
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
  const [visible, setVisible] = useState<boolean>(false)
  const data = useLazyLoadQuery<pages_index_CategoryList_Query>(query, { limit: 10 })

  console.log(data.categoryList)
  return (
    <LayoutTemplate>
      <div>index</div>
      <button onClick={() => setVisible(true)}>modal</button>
      <Modal visible={visible} title="Modal Title" onClose={() => setVisible(false)}>
        Modal Content
      </Modal>
    </LayoutTemplate>
  )
}
