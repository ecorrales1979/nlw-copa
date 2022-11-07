import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'native-base'
import { PlusCircle, SoccerBall } from 'phosphor-react-native'

import { Details } from '../screens/Details'
import { Find } from '../screens/Find'
import { New } from '../screens/New'
import { Polls } from '../screens/Polls'

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes() {
  const { colors, sizes } = useTheme()

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.yellow[500],
      tabBarInactiveTintColor: colors.gray[300],
      tabBarLabelPosition: 'beside-icon',
      tabBarStyle: {
        position: 'absolute',
        height: sizes[22],
        borderTopWidth: 0,
        backgroundColor: colors.gray[800],
      },
      tabBarItemStyle: {
        position: 'relative',
        top: Platform.OS === 'android' ? -10 : 0,
      }
    }}>
      <Screen name="polls" component={Polls} options={{
        tabBarIcon: ({ color }) => <SoccerBall color={color} size={sizes[6]} />,
        tabBarLabel: 'Meus bolões'
      }} />
      <Screen name="new" component={New} options={{
        tabBarIcon: ({ color }) => <PlusCircle color={color} size={sizes[6]} />,
        tabBarLabel: 'Novo bolão'
      }} />
      <Screen name="find" component={Find} options={{ tabBarButton: () => null }} />
      <Screen name="details" component={Details} options={{ tabBarButton: () => null }} />
    </Navigator>
  )
}