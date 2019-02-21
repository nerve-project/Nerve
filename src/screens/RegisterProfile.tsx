import React, { Component } from 'react'
import { Animated, AsyncStorage, Button, StyleSheet, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

interface Props {}

export default class RegisterProfile extends Component<Props> {
  _fadeIn: Animated.Value

  constructor(props: Props) {
    super(props)

    this._fadeIn = new Animated.Value(0)
    this._getStorage()
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
        <Text style={styles.welcome}>Register Profile</Text>
        <Button 
          title='프로필 등록'
          onPress={() => Actions.replace('registerPassword')}
        />
      </Animated.View>
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
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})