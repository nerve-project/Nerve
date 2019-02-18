import React, { Component } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

interface Props {}

export default class RegisterProfile extends Component<Props> {
  render(): JSX.Element {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Register Password</Text>
        <Button 
          title='패스워드 등록'
          onPress={() => Actions.home()}
        />
      </View>
    )
  }
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})