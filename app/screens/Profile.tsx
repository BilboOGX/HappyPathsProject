import { View, Text, Button } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../FireBaseConfig'

const Profile = ({navigation}: any) => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      {/* <Button onPress={() => navigation.navigate('+')} title="Open Details" /> */}
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
      <Button onPress={() => navigation.navigate('MyListings')} title='Go to my listings'/>
      <View>
        <Text>
          Username: 
        </Text>
      </View>
    </View>
  )
}

export default Profile