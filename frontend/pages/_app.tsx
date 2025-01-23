import type { AppProps } from 'next/app'
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Component {...pageProps} />
      </PaperProvider>
    </NavigationContainer>
  )
} 