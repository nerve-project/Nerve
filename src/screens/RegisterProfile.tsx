import React, { Component } from 'react'
import { AsyncStorage, Button, StyleSheet, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

interface Props {}

export default class RegisterProfile extends Component<Props> {
  constructor(props: Props) {
    super(props)

    this._getStorage()
  }

  async _getStorage(): Promise<void> {
    const userInfo: any = await AsyncStorage.getItem('userInfo')

    console.log(JSON.parse(userInfo))
  }

  render(): JSX.Element {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Register Profile</Text>
        <Button 
          title='프로필 등록'
          onPress={() => Actions.registerPassword()}
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