import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'

const SingleBookPage = ({navigation, route}) => {
    console.log(route.params.title)
    const bookTitle = route.params.title
  return (
    <View style={styles.container}>
      <Text>{bookTitle}</Text>
      <Button title='Order now'/>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
})

export default SingleBookPage