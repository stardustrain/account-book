/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime'
export type pages_index_CategoryList_QueryVariables = {
  limit?: number | null
}
export type pages_index_CategoryList_QueryResponse = {
  readonly categoryList: ReadonlyArray<{
    readonly title: string
    readonly categoryType: string
  }> | null
}
export type pages_index_CategoryList_Query = {
  readonly response: pages_index_CategoryList_QueryResponse
  readonly variables: pages_index_CategoryList_QueryVariables
}

/*
query pages_index_CategoryList_Query(
  $limit: Int
) {
  categoryList(limit: $limit) {
    title
    categoryType
    id
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'limit',
      },
    ],
    v1 = [
      {
        kind: 'Variable',
        name: 'limit',
        variableName: 'limit',
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'title',
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'categoryType',
      storageKey: null,
    }
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Fragment',
      metadata: null,
      name: 'pages_index_CategoryList_Query',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'Category',
          kind: 'LinkedField',
          name: 'categoryList',
          plural: true,
          selections: [v2 /*: any*/, v3 /*: any*/],
          storageKey: null,
        },
      ],
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Operation',
      name: 'pages_index_CategoryList_Query',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'Category',
          kind: 'LinkedField',
          name: 'categoryList',
          plural: true,
          selections: [
            v2 /*: any*/,
            v3 /*: any*/,
            {
              alias: null,
              args: null,
              kind: 'ScalarField',
              name: 'id',
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: 'c03d447593f2190e7bf0172d7663a3c4',
      id: null,
      metadata: {},
      name: 'pages_index_CategoryList_Query',
      operationKind: 'query',
      text: 'query pages_index_CategoryList_Query(\n  $limit: Int\n) {\n  categoryList(limit: $limit) {\n    title\n    categoryType\n    id\n  }\n}\n',
    },
  }
})()
;(node as any).hash = '16856a083d207452b1700a5edfcccede'
export default node
