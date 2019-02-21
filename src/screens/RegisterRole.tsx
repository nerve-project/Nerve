import React, { Component } from 'react'
import { Animated, AsyncStorage, Button, StyleSheet, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { UserInfo } from '../common/NerveInterface'

interface Props {}

export default class RegisterRole extends Component<Props> {
  _fadeIn: Animated.Value

  constructor(props: Props) {
    super(props)

    this._fadeIn = new Animated.Value(0)
  }

  componentDidMount(): void {
    Animated.timing(
      this._fadeIn,
      {
        toValue: 1,
        duration: 1000
      }
    ).start();   
  }

  render(): React.ReactNode {
    return (
      <Animated.View style={{...styles.container, opacity: this._fadeIn}}>
        <Text style={styles.welcome}>Register Role</Text>
        <Button 
          title='Player'
          onPress={() => this._setRoleData('player')}
        />
        <Button 
          title='Watcher'
          onPress={() => this._setRoleData('watcher')}
        />
      </Animated.View>
    )
  }

  _setRoleData =  async (role: string): Promise<void> => {
    const userData: any = await AsyncStorage.getItem('userInfo')
    const infoData: any = JSON.parse(userData)
    const { uniqueId, password, canTouchId } = infoData
    
    const userInfo: UserInfo = {
      uniqueId: uniqueId,
      role: role,
      password: password,
      canTouchId: canTouchId
    }

    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))

    Actions.replace('registerProfile')
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