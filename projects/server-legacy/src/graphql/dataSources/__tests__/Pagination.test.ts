import Pagination from '../Pagination'

class SetParamsTest extends Pagination {
  // @ts-expect-error
  getMockData = (args) => {
    // @ts-ignore
    this.setParams(args)
  }
}
const setParamsTest = new SetParamsTest('SetParamsTest')

class ErrorWithNodesTest extends Pagination {
  // @ts-expect-error
  getMockData = (args) => {
    // @ts-ignore
    this.setParams(args)
    this.generatePaginationResponse()
  }
}

class PaginationTest extends Pagination {
  constructor(typeName: string) {
    super(typeName)
  }

  // @ts-expect-error
  getMockData = (args) => {
    // @ts-ignore
    this.setParams(args)
    this.nodes = [
      { id: 1, title: 'test' },
      { id: 2, title: 'test2' },
      { id: 3, title: 'test3' },
      { id: 4, title: 'test4' },
      { id: 5, title: 'test5' },
    ]
    return this.generatePaginationResponse()
  }
}

describe('Pagination.ts', () => {
  test('shloud throw error if received invalid pagination options through setParms().', () => {
    expect(() => {
      setParamsTest.getMockData({ after: 'after', before: 'before' })
    }).toThrowError('Use only one of "after" and "before".')
    expect(() => {
      setParamsTest.getMockData({ after: 'after', before: 'before', first: 10, last: 10 })
    }).toThrowError('Use only one of "after" and "before".')
    expect(() => {
      setParamsTest.getMockData({ after: 'after', first: 10, last: 10 })
    }).toThrowError('If you are going to use "after", do not pass "last".')
    expect(() => {
      setParamsTest.getMockData({ before: 'before', first: 10, last: 10 })
    }).toThrowError('If you are going to use "before", do not pass "first".')
    expect(() => {
      setParamsTest.getMockData({ after: 'after', first: 101 })
    }).toThrowError('"first" must be integer between 0 and 100.')
    expect(() => {
      setParamsTest.getMockData({ after: 'after', first: -1 })
    }).toThrowError('"first" must be integer between 0 and 100.')
    expect(() => {
      setParamsTest.getMockData({ before: 'before', last: 101 })
    }).toThrowError('"last" must be integer between 0 and 100')
    expect(() => {
      setParamsTest.getMockData({ before: 'before', last: -1 })
    }).toThrowError('"last" must be integer between 0 and 100')
    expect(() => {
      setParamsTest.getMockData({ first: 10 })
    }).toThrowError('"first" must using with "after"')
    expect(() => {
      setParamsTest.getMockData({ last: 10 })
    }).toThrowError('"last" must using with "before"')
  })

  test('should return valid findManyOptions if pass to pagination options validation.', () => {
    const OPTIONS_EXPECTED_FORWARD = { after: 'Q2F0ZWdvcnk6MTc=', first: 15 }
    const OPTIONS_EXPECTED_BACKWARD = { before: 'Q2F0ZWdvcnk6MTc=', last: 30 }

    setParamsTest.getMockData(OPTIONS_EXPECTED_FORWARD)
    expect(setParamsTest.findManyOptions).toEqual({
      skip: 1,
      cursor: {
        id: 17,
      },
      take: 16,
    })
    setParamsTest.getMockData(OPTIONS_EXPECTED_BACKWARD)
    expect(setParamsTest.findManyOptions).toEqual({
      skip: 1,
      cursor: {
        id: 17,
      },
      take: -31,
    })
  })

  test('should return valid findManyOptions with DEFAULT_PAGE_SIZE (20) if after and last are not exist.', () => {
    setParamsTest.getMockData({ after: 'Q2F0ZWdvcnk6MTc=' })
    expect(setParamsTest.findManyOptions).toEqual({
      skip: 1,
      cursor: {
        id: 17,
      },
      take: 21,
    })
    setParamsTest.getMockData({ before: 'Q2F0ZWdvcnk6MTc=' })
    expect(setParamsTest.findManyOptions).toEqual({
      skip: 1,
      cursor: {
        id: 17,
      },
      take: -21,
    })
  })

  test('should return only "take" property if pass empty object to setParams().', () => {
    setParamsTest.getMockData({})
    expect(setParamsTest.findManyOptions).toEqual({
      take: 21,
    })
  })

  test('should throw error if does not assign array of data to this._nodes through this.nodes().', () => {
    const errorWithNodes = new ErrorWithNodesTest('ErrorWithNodesTest')

    expect(() => {
      errorWithNodes.getMockData({})
    }).toThrow('Does not exist nodes. Please check to assign this.nodes in your resolver.')
  })

  test('should return connection style list with this.generatePaginationResponse().', () => {
    const paginationTest = new PaginationTest('Dummy')

    expect(paginationTest.getMockData({})).toEqual({
      pageInfo: {
        endCursor: 'Q3Vyc29yOjU=',
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: 'Q3Vyc29yOjE=',
      },
      edges: [
        {
          cursor: 'Q3Vyc29yOjE=',
          node: {
            id: 'RHVtbXk6MQ==',
            title: 'test',
          },
        },
        {
          cursor: 'Q3Vyc29yOjI=',
          node: {
            id: 'RHVtbXk6Mg==',
            title: 'test2',
          },
        },
        {
          cursor: 'Q3Vyc29yOjM=',
          node: {
            id: 'RHVtbXk6Mw==',
            title: 'test3',
          },
        },
        {
          cursor: 'Q3Vyc29yOjQ=',
          node: {
            id: 'RHVtbXk6NA==',
            title: 'test4',
          },
        },
        {
          cursor: 'Q3Vyc29yOjU=',
          node: {
            id: 'RHVtbXk6NQ==',
            title: 'test5',
          },
        },
      ],
    })
  })
})
