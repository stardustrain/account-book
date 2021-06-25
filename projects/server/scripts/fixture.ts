export const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min
const getTrueOrFalse = () => getRandom(0, 2) === 1

export const users = [
  {
    email: 'admin@test.com',
    name: 'admin',
  },
  {
    email: 'user1@test.com',
    name: 'user1',
  },
]

export const categories = [
  {
    title: 'Waxi',
  },
  {
    title: 'Krasnaya Polyana',
  },
  {
    title: 'Qamdo',
  },
  {
    title: 'Liuyuan',
  },
  {
    title: 'Jingkou',
  },
  {
    title: 'Jetaral',
  },
  {
    title: 'Minante Segundo',
  },
  {
    title: 'Polunochnoye',
  },
  {
    title: 'Bakhmach',
  },
  {
    title: 'Thành phố Bạc Liêu',
  },
  {
    title: 'Dakhla',
  },
  {
    title: 'Mali',
  },
  {
    title: 'Xiongji',
  },
  {
    title: 'San Juan',
  },
  {
    title: 'Seixezelo',
  },
  {
    title: 'Ābyek',
  },
  {
    title: 'Nuevo Arraiján',
  },
  {
    title: 'Uppsala',
  },
  {
    title: 'Cungkal',
  },
  {
    title: 'Qiqian',
  },
  {
    title: 'Guozhen',
  },
  {
    title: 'Växjö',
  },
  {
    title: 'Magugu',
  },
  {
    title: 'Yanping',
  },
  {
    title: 'Itō',
  },
  {
    title: 'Retiro',
  },
  {
    title: 'Usicayos',
  },
  {
    title: 'Kawangkoan',
  },
  {
    title: 'Bangued',
  },
  {
    title: 'Wrocław',
  },
].map((category) => ({
  ...category,
  categoryType: getTrueOrFalse() ? 'INCOME' : 'EXPENSES',
}))

export const ledgerItems = [
  {
    date: '2020-04-23T04:19:40Z',
    description: 'Switchable tangible matrices',
    tag: 'Computers',
  },
  {
    date: '2020-03-29T07:06:46Z',
    description: 'Stand-alone contextually-based capability',
    tag: null,
  },
  {
    date: '2020-04-05T11:17:13Z',
    description: 'Distributed upward-trending archive',
    tag: null,
  },
  {
    date: '2020-04-07T11:26:40Z',
    description: 'Streamlined tertiary conglomeration',
    tag: 'Kids',
  },
  {
    date: '2020-11-17T20:50:49Z',
    description: 'Distributed disintermediate throughput',
    tag: null,
  },
  {
    date: '2021-04-10T03:07:13Z',
    description: 'Public-key high-level model',
    tag: null,
  },
  {
    date: '2021-02-26T12:01:17Z',
    description: 'Reduced didactic architecture',
    tag: null,
  },
  {
    date: '2021-04-12T07:15:43Z',
    description: 'Stand-alone holistic moderator',
    tag: null,
  },
  {
    date: '2020-07-14T09:03:31Z',
    description: 'Implemented client-driven collaboration',
    tag: 'Automotive',
  },
  {
    date: '2020-12-02T09:58:06Z',
    description: 'Diverse systemic architecture',
    tag: null,
  },
  {
    date: '2020-08-27T02:12:30Z',
    description: 'Exclusive 3rd generation paradigm',
    tag: null,
  },
  {
    date: '2021-04-05T05:50:54Z',
    description: 'Grass-roots context-sensitive capability',
    tag: 'Health',
  },
  {
    date: '2020-04-17T03:57:54Z',
    description: 'Down-sized human-resource framework',
    tag: null,
  },
  {
    date: '2021-02-04T11:45:01Z',
    description: 'Multi-tiered analyzing budgetary management',
    tag: null,
  },
  {
    date: '2020-07-03T14:32:33Z',
    description: 'Assimilated systemic instruction set',
    tag: null,
  },
  {
    date: '2021-05-12T21:40:28Z',
    description: 'Robust analyzing product',
    tag: 'Sports',
  },
  {
    date: '2020-07-11T22:29:35Z',
    description: 'Centralized directional service-desk',
    tag: null,
  },
  {
    date: '2021-02-06T03:28:23Z',
    description: 'Realigned fault-tolerant migration',
    tag: null,
  },
  {
    date: '2020-05-07T15:42:44Z',
    description: 'Assimilated neutral support',
    tag: 'Music',
  },
  {
    date: '2020-10-17T20:14:47Z',
    description: 'Cloned leading edge policy',
    tag: null,
  },
  {
    date: '2020-06-10T15:48:13Z',
    description: 'Persistent non-volatile algorithm',
    tag: 'Garden',
  },
  {
    date: '2020-06-21T14:23:52Z',
    description: 'User-friendly fault-tolerant attitude',
    tag: null,
  },
  {
    date: '2020-05-16T18:57:44Z',
    description: 'Visionary 5th generation benchmark',
    tag: 'Automotive',
  },
  {
    date: '2020-04-24T16:56:43Z',
    description: 'Operative 24 hour success',
    tag: null,
  },
  {
    date: '2020-07-03T04:22:10Z',
    description: 'Team-oriented regional paradigm',
    tag: 'Sports',
  },
  {
    date: '2020-05-29T23:52:41Z',
    description: 'Horizontal demand-driven knowledge base',
    tag: 'Automotive',
  },
  {
    date: '2020-04-01T05:57:44Z',
    description: 'Front-line empowering throughput',
    tag: 'Beauty',
  },
  {
    date: '2020-04-23T21:34:28Z',
    description: 'Devolved next generation extranet',
    tag: null,
  },
  {
    date: '2020-03-22T15:04:00Z',
    description: 'Multi-channelled client-server model',
    tag: null,
  },
  {
    date: '2021-05-13T16:09:01Z',
    description: 'Object-based 4th generation portal',
    tag: null,
  },
  {
    date: '2020-11-28T07:27:00Z',
    description: 'Advanced background hardware',
    tag: null,
  },
  {
    date: '2020-08-19T19:26:06Z',
    description: 'Balanced well-modulated encryption',
    tag: 'Tools',
  },
  {
    date: '2020-11-12T19:41:12Z',
    description: 'Multi-tiered logistical groupware',
    tag: null,
  },
  {
    date: '2021-02-06T00:47:50Z',
    description: 'Re-contextualized directional productivity',
    tag: null,
  },
  {
    date: '2020-04-16T03:44:43Z',
    description: 'Intuitive intangible toolset',
    tag: null,
  },
  {
    date: '2020-09-21T07:03:02Z',
    description: 'Stand-alone eco-centric artificial intelligence',
    tag: null,
  },
  {
    date: '2020-09-20T23:40:43Z',
    description: 'Mandatory asynchronous internet solution',
    tag: null,
  },
  {
    date: '2021-02-14T16:07:35Z',
    description: 'Visionary bi-directional secured line',
    tag: 'Baby',
  },
  {
    date: '2021-04-06T16:28:26Z',
    description: 'Polarised full-range Graphic Interface',
    tag: null,
  },
  {
    date: '2020-10-26T06:03:34Z',
    description: 'Versatile mobile protocol',
    tag: 'Grocery',
  },
  {
    date: '2020-11-28T07:23:57Z',
    description: 'Public-key executive system engine',
    tag: 'Health',
  },
  {
    date: '2021-05-03T16:17:00Z',
    description: 'Versatile mobile Graphic Interface',
    tag: 'Garden',
  },
  {
    date: '2020-02-29T06:59:55Z',
    description: 'Enterprise-wide foreground hierarchy',
    tag: 'Tools',
  },
  {
    date: '2021-02-08T07:53:02Z',
    description: 'Proactive intangible neural-net',
    tag: null,
  },
  {
    date: '2020-08-24T05:16:03Z',
    description: 'Managed global hub',
    tag: null,
  },
  {
    date: '2021-02-28T04:02:29Z',
    description: 'Enterprise-wide bifurcated array',
    tag: 'Kids',
  },
  {
    date: '2020-02-26T20:02:40Z',
    description: 'Object-based real-time support',
    tag: null,
  },
  {
    date: '2020-09-19T10:54:36Z',
    description: 'Proactive directional methodology',
    tag: null,
  },
  {
    date: '2021-02-07T13:22:22Z',
    description: 'Optional fault-tolerant orchestration',
    tag: null,
  },
  {
    date: '2021-05-19T06:04:19Z',
    description: 'Persistent global adapter',
    tag: null,
  },
  {
    date: '2020-06-23T02:50:19Z',
    description: 'Down-sized eco-centric product',
    tag: 'Sports',
  },
  {
    date: '2020-07-06T20:19:03Z',
    description: 'Intuitive regional internet solution',
    tag: null,
  },
  {
    date: '2020-02-10T12:01:33Z',
    description: 'Secured mobile paradigm',
    tag: null,
  },
  {
    date: '2021-04-22T10:47:05Z',
    description: 'Right-sized neutral hierarchy',
    tag: 'Kids',
  },
  {
    date: '2020-05-17T17:23:46Z',
    description: 'Networked zero administration portal',
    tag: 'Outdoors',
  },
  {
    date: '2020-09-24T05:31:20Z',
    description: 'Face to face directional conglomeration',
    tag: 'Baby',
  },
  {
    date: '2021-02-03T22:27:19Z',
    description: 'Public-key solution-oriented productivity',
    tag: 'Toys',
  },
  {
    date: '2020-06-13T10:14:22Z',
    description: 'Cross-group transitional software',
    tag: null,
  },
  {
    date: '2020-12-02T11:13:44Z',
    description: 'Exclusive global leverage',
    tag: 'Clothing',
  },
  {
    date: '2020-12-11T15:43:38Z',
    description: 'Phased static standardization',
    tag: null,
  },
  {
    date: '2021-01-04T12:40:24Z',
    description: 'Focused intangible access',
    tag: 'Music',
  },
  {
    date: '2020-10-23T21:25:44Z',
    description: 'Distributed discrete open architecture',
    tag: null,
  },
  {
    date: '2021-02-06T20:16:21Z',
    description: 'Persevering full-range hub',
    tag: 'Clothing',
  },
  {
    date: '2020-10-26T11:37:15Z',
    description: 'Centralized fault-tolerant system engine',
    tag: 'Electronics',
  },
  {
    date: '2021-03-21T20:16:30Z',
    description: 'Optional hybrid capacity',
    tag: null,
  },
  {
    date: '2021-01-14T19:01:59Z',
    description: 'Open-architected next generation model',
    tag: 'Garden',
  },
  {
    date: '2021-03-12T10:47:32Z',
    description: 'Compatible even-keeled frame',
    tag: null,
  },
  {
    date: '2020-08-07T12:38:15Z',
    description: 'Progressive zero administration definition',
    tag: 'Toys',
  },
  {
    date: '2020-04-24T00:51:00Z',
    description: 'Optimized reciprocal encoding',
    tag: 'Jewelry',
  },
  {
    date: '2020-04-19T15:57:11Z',
    description: 'Customer-focused bandwidth-monitored time-frame',
    tag: 'Movies',
  },
  {
    date: '2020-04-23T01:33:35Z',
    description: 'Persevering bi-directional groupware',
    tag: 'Tools',
  },
  {
    date: '2021-05-08T17:43:53Z',
    description: 'Integrated modular challenge',
    tag: null,
  },
  {
    date: '2020-06-15T04:42:34Z',
    description: 'Optional value-added standardization',
    tag: null,
  },
  {
    date: '2020-07-28T18:15:29Z',
    description: 'Down-sized zero tolerance toolset',
    tag: null,
  },
  {
    date: '2020-08-13T14:46:37Z',
    description: 'Public-key zero tolerance definition',
    tag: null,
  },
  {
    date: '2020-12-07T17:24:02Z',
    description: 'Universal impactful Graphical User Interface',
    tag: 'Automotive',
  },
  {
    date: '2021-04-27T04:47:34Z',
    description: 'Open-source interactive collaboration',
    tag: null,
  },
  {
    date: '2021-01-20T22:14:02Z',
    description: 'Managed system-worthy contingency',
    tag: null,
  },
  {
    date: '2020-02-11T18:30:34Z',
    description: 'Down-sized didactic intranet',
    tag: null,
  },
  {
    date: '2021-03-30T20:44:18Z',
    description: 'User-centric web-enabled intranet',
    tag: null,
  },
  {
    date: '2020-10-22T23:22:39Z',
    description: 'Extended executive pricing structure',
    tag: 'Garden',
  },
  {
    date: '2020-07-07T21:21:56Z',
    description: 'Synchronised context-sensitive array',
    tag: 'Home',
  },
  {
    date: '2020-08-06T07:16:55Z',
    description: 'Organic optimal contingency',
    tag: 'Shoes',
  },
  {
    date: '2020-08-30T19:21:53Z',
    description: 'Self-enabling holistic capability',
    tag: 'Games',
  },
  {
    date: '2020-02-23T04:58:21Z',
    description: 'Multi-tiered contextually-based challenge',
    tag: null,
  },
  {
    date: '2021-03-30T21:40:33Z',
    description: 'Universal demand-driven Graphic Interface',
    tag: null,
  },
  {
    date: '2021-02-04T19:11:52Z',
    description: 'Fully-configurable 3rd generation neural-net',
    tag: null,
  },
  {
    date: '2020-09-10T08:00:32Z',
    description: 'Ameliorated uniform throughput',
    tag: 'Garden',
  },
  {
    date: '2020-12-16T04:14:45Z',
    description: 'Total heuristic alliance',
    tag: null,
  },
  {
    date: '2020-07-20T01:42:14Z',
    description: 'Reduced zero defect attitude',
    tag: 'Computers',
  },
  {
    date: '2020-09-25T22:55:14Z',
    description: 'Implemented motivating moderator',
    tag: null,
  },
  {
    date: '2020-03-26T05:00:10Z',
    description: 'Synchronised solution-oriented secured line',
    tag: null,
  },
  {
    date: '2020-10-20T11:12:58Z',
    description: 'Exclusive bifurcated workforce',
    tag: 'Baby',
  },
  {
    date: '2020-10-01T21:23:18Z',
    description: 'Organic asynchronous archive',
    tag: null,
  },
  {
    date: '2021-03-24T08:24:44Z',
    description: 'Focused national task-force',
    tag: 'Baby',
  },
  {
    date: '2021-02-03T00:35:16Z',
    description: 'Configurable content-based concept',
    tag: 'Music',
  },
  {
    date: '2021-04-08T22:42:45Z',
    description: 'Universal interactive focus group',
    tag: null,
  },
  {
    date: '2020-03-25T06:52:50Z',
    description: 'Future-proofed next generation core',
    tag: 'Garden',
  },
  {
    date: '2021-04-13T23:53:52Z',
    description: 'Focused bi-directional solution',
    tag: null,
  },
  {
    date: '2020-07-07T15:42:52Z',
    description: 'Integrated systemic migration',
    tag: 'Computers',
  },
].map((item) => {
  const cost = getRandom(1000, 3000000)
  const purchase = getTrueOrFalse()
    ? {
        cash: cost,
      }
    : {
        card: cost,
      }

  return {
    ...item,
    ...purchase,
  }
})
