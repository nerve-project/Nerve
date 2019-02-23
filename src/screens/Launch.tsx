import React, { Component } from 'react'
import { Alert, Animated, AsyncStorage, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import DeviceInfo from 'react-native-device-info'
import TouchID from 'react-native-touch-id'
import SplashScreen from 'react-native-splash-screen'
import LinearGradient from 'react-native-linear-gradient'

import NerveFonts from '../common/NerveFonts'
import { UserInfo } from '../common/NerveInterface'
import NerveSize from '../common/NerveSize'

interface Props { }

export default class Launch extends Component<Props> {
  _fadeIn: Animated.Value
  _scaleAnim: Animated.Value

  constructor(props: Props) {
    super(props)

    this._fadeIn = new Animated.Value(0)
    this._scaleAnim = new Animated.Value(0)

    AsyncStorage.removeItem('userInfo')
    this._bootstrapAsync()
  }

  componentDidMount(): void {
    SplashScreen.hide()

    Animated.sequence([
      Animated.timing(
        this._fadeIn,
        {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this._scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true
        }
      )
    ])
    .start(() => this._runTask())
  }

  render(): React.ReactNode {
    return (
      <Animated.View style={{...styles.gradientContainer, opacity: this._fadeIn}}>
        <StatusBar hidden={true} />
        <LinearGradient
          colors={['#FFB05B', '#F6D365']}
          style={styles.gradientContainer}>
          <View style={styles.mainContainer}>
            <Text style={styles.title}>NERVE</Text>
            <Animated.View style={{...styles.bar, transform: [{ scale: this._scaleAnim }]}} />
          </View>
        </LinearGradient>
      </Animated.View>
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

  _runTask = async (): Promise<void> => {
    const userInfo: any = await AsyncStorage.getItem('userInfo')
    const infoData: any = JSON.parse(userInfo)

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
  gradientContainer: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
