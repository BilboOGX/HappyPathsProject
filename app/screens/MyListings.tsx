import { View, Text } from 'react-native'
import React from 'react'

const MyListings = ({ route }) => {
  const user = route.params.user;
  return (
    <View>
      <Text>{user.username}'s Listings</Text>
    </View>
  )
}

export default MyListings