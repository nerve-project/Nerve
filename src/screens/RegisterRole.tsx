import React, { Component } from 'react'
import { AsyncStorage, Button, StyleSheet, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { UserInfo } from '../common/NerveInterface'

export default class RegisterRole extends Component {

  async _setRoleData(setVal: string): Promise<void> {
    const userData: any = await AsyncStorage.getItem('userInfo')
    const infoData: any = JSON.parse(userData)
    const { uniqueId, password } = infoData
    
    const userInfo: UserInfo = {
      uniqueId: uniqueId,
      role: setVal,
      password: password
    }

    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))

    Actions.registerProfile()
  }

  render(): JSX.Element {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Register Role</Text>
        <Button 
          title='Player'
          onPress={() => this._setRoleData('player')}
        />
        <Button 
          title='Watcher'
          onPress={() => this._setRoleData('watcher')}
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