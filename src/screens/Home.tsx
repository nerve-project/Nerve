import React, { Component } from 'react'
import { AsyncStorage, Platform, StyleSheet, Text, View } from 'react-native'

const instructions: string = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
})

interface Props { }

export default class Home extends Component<Props> {
  constructor(props: Props) {
    super(props)

    this._getStorage()
  }

  render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.tsx</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    )
  }

  _getStorage = async (): Promise<void> => {
    const userInfo: any = await AsyncStorage.getItem('userInfo')

    console.log(JSON.parse(userInfo))
  }
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
