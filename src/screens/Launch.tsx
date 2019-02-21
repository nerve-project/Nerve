import React, { Component } from 'react'
import { Alert, Animated, AsyncStorage, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import DeviceInfo from 'react-native-device-info'
import TouchID from 'react-native-touch-id'

import NerveFonts from '../common/NerveFonts'
import { UserInfo } from '../common/NerveInterface'
import NerveSize from '../common/NerveSize'

interface Props { }

interface State {
  scaleAnim: Animated.Value
}

export default class Launch extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      scaleAnim: new Animated.Value(0)
    }

    // AsyncStorage.removeItem('userInfo')
    this._bootstrapAsync()
  }

  async componentDidMount(): Promise<void> {
    const finished: any = await this._performTimeConsumingTask()
    const userInfo: any = await AsyncStorage.getItem('userInfo')
    const infoData: any = JSON.parse(userInfo)

    if (finished !== null) {
      Animated.timing(
        this.state.scaleAnim, {
          toValue: 1,
          duration: 3000
        }
      ).start(() => {
        console.log(infoData)

        if (infoData.role == '' || infoData.password == '') {
          Actions.replace('register')
        } else {
          if (infoData.canTouchId) {
            this._launchLocalAuth()
          } else {
            Actions.replace('patternAuth')
          }
        }
      })
      
    }
  }

  render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Text style={styles.title}>NERVE</Text>
        <Animated.View style={{...styles.bar, transform: [{ scale: this.state.scaleAnim }]}} />
      </View>
    )
  }

  _bootstrapAsync = async (): Promise<void> => {
    try {
      const userInfo: any = await AsyncStorage.getItem('userInfo')
      
      if (userInfo === null) {
        this._initAsync()
      }
    } catch (error) {
      console.log(`bootstrapAsync Error: ${error}`)
    }
  }

  _initAsync = async (): Promise<void> => {
    try {
      const uniqueId: string = DeviceInfo.getUniqueID()
      const userInfo: UserInfo = {
        uniqueId: uniqueId,
        role: '',
        password: '',
        canTouchId: false
      }

      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
      this._bootstrapAsync()
    } catch (error) {
      console.log(`storageDeviceInfo Error: ${error}`)
    }
  }

  _performTimeConsumingTask = async (): Promise<{}> => {
    return new Promise((resolve) => 
      setTimeout(
        () => { resolve('result') },
        200
      )
    )
  }

  _launchLocalAuth = () => {
    const optionalConfigObject: any = Platform.select({
      ios: {
        fallbackLabel: 'PASSCODE 인증',
        passcodeFallback: false
      },
      android: {
        title: '지문인증',
        imageColor: '#e00606',
        imageErrorColor: '#ff0000',
        sensorDescription: '터치센서',
        sensorErrorDescription: '인증실패',
        cancelText: '지문인증 사용안함'
      }
    })

    TouchID.authenticate('생체인증', optionalConfigObject)
      .then((success: any) => {
        if (success) {
          Actions.replace('home')
        }
      })
      .catch((error: any) => {
        Alert.alert(
          '생체인증 실패',
          '패턴으로 인증합니다.',
          [
            {text: '패턴인증', onPress: () => Actions.replace('patternAuth')}
          ],
          {cancelable: false}
        )
      })
  }
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange'
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    fontFamily: NerveFonts.en('bold')
  },
  bar: {
    position: 'absolute',
    bottom: 40,
    width: NerveSize.deviceWidth() / 2,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2
  }
})
