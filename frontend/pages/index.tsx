import { View } from 'react-native'
import { Title, Text } from 'react-native-paper'

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Title>Bienvenue sur Flegm</Title>
      <Text>La plateforme de découverte de créateurs de contenu</Text>
    </View>
  )
} 