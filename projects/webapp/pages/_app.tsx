import '../styles/globals.css'
import { RelayEnvironmentProvider } from 'react-relay/hooks'
import { useEnvironment } from '../relay/relayEnvironment'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const environment = useEnvironment(pageProps.initialRecords)
  return (
    <RelayEnvironmentProvider environment={environment}>
      <Component {...pageProps} />
    </RelayEnvironmentProvider>
  )
}

export default MyApp
