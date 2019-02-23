import React, { Component } from 'react'
import { Alert, Animated, AsyncStorage, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import TouchID from 'react-native-touch-id'

import GesturePassword from '../components/GesturePassword'

import NerveFonts from '../common/NerveFonts'
import NerveSize from '../common/NerveSize'

import { UserInfo } from '../common/NerveInterface'

interface Props {}

interface State {
  isWarning: boolean
  message: string
  messageColor: string
  password: string
  thumbnails: any
}

export default class RegisterProfile extends Component<Props, State> {
  _cachedPassword: string
  _fadeIn: Animated.Value

  constructor(props: Props) {
    super(props)

    this.state = {
      isWarning: false,
      message: '인증패턴을 입력하세요.',
      messageColor: '#A9A9A9',
      password: '',
      thumbnails: []
    }

    this._cachedPassword = ''
    this._fadeIn = new Animated.Value(0)
  }

  componentDidMount(): void {
    Animated.timing(
      this._fadeIn,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }
    ).start();   
  }

  render(): React.ReactNode {
    return (
      <Animated.View style={{...styles.container, opacity: this._fadeIn}}>
        <StatusBar translucent={true} backgroundColor={'#F5FCFF'} barStyle={'dark-content'} />
        <GesturePassword
          style={styles.passwordContainer}
          pointBackgroundColor={'#F4F4F4'}
          isWarning={this.state.isWarning}
          gestureAreaLength={NerveSize.deviceWidth() * 0.8}
          color={'#A9A9A9'}
          activeColor={'#00AAEF'}
          warningColor={'red'}
          warningDuration={1500}
          allowCross={true}
          topComponent={this._renderDescription()}
          onFinish={this._onFinish}
          onReset={this._onReset}
        />
      </Animated.View>
    )
  }

  _renderDescription = (): React.ReactNode => {
    return (
      <View style={styles.descContainer}>
        {this._renderThumbnails()}
        <Text style={[styles.descText, {color: this.state.messageColor}]}>
          {this.state.message}
        </Text>
      </View>
    )
  }

  _renderThumbnails = (): React.ReactNode => {
    let thumbnails: any = []

    for (let i: number = 0; i < 9; i++) {
      const active: number = ~this.state.password.indexOf(`${i}`)

      thumbnails.push((
        <View
          key={`thumb-${i}`}
          style={[
            styles.thumbItems,
            active ? {backgroundColor: '#00AAEF'} : {borderWidth: 1, borderColor: '#A9A9A9'}
          ]}
        />
      ))
    }

    return (
      <View style={styles.thumbContainer}>
        {thumbnails}
      </View>
    )
  }

  _onFinish = (password: string): void => {
    if (this.state.password == '') {
      this._cachedPassword = password

      this._onReset()
    } else {
      if (this.state.password == password) {
        this._setPasswordData(password)
      } else {
        this._cachedPassword = ''

        Alert.alert(
          '인증패턴 등록 실패',
          '인증패턴이 일치하지 않습니다',
          [
            {text: '확인', onPress: () => this._onReset()}
          ],
          {cancelable: false}
        )
      }
    }
  }

  _onReset = (): void => {
    if (this._cachedPassword != '') {
      const isWarning: boolean = false
      const message: string = '인증패턴을 다시한번 입력하세요.'
      const messageColor: string = 'red'

      this.setState({
        isWarning: isWarning,
        message: message,
        messageColor: messageColor,
        password: this._cachedPassword
      })
    } else {
      const isWarning = false
      const message = '인증패턴을 입력하세요.'
      const messageColor = '#A9A9A9'

      this.setState({
        isWarning: isWarning,
        message: message,
        messageColor: messageColor,
        password: this._cachedPassword
      })
    }
  }

  _setPasswordData = async (password: string): Promise<void> => {
    const userData: any = await AsyncStorage.getItem('userInfo')
    const infoData: any = JSON.parse(userData)
    const { uniqueId, role, canTouchId } = infoData
    
    const userInfo: UserInfo = {
      uniqueId: uniqueId,
      role: role,
      password: password,
      canTouchId: canTouchId
    }

    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))

    TouchID.isSupported()
      .then((biometryType: string) => {
        this._launchLocalAuth()
      })
      .catch ((error: any) => {
        Platform.select({
          ios: this._noTouchIdios(error.name),
          android: this._noTouchIdadnroid(error.code)
        })
      })
  }

  _noTouchIdios = (error: string) => {
    Actions.replace('home')
  }

  _noTouchIdadnroid = (error: string) => {
    Actions.replace('home')
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

    TouchID.authenticate('생체인증등록', optionalConfigObject)
      .then((success: any) => {
        if (success) {
          this._setLocalAuth(success)
        }
      })
      .catch((error: any) => {
        Alert.alert(
          '생체인증 등록 실패',
          'Nerve에서 생체인증을 사용하지 않습니다.',
          [
            {text: '확인', onPress: () => Actions.replace('home')}
          ],
          {cancelable: false}
        )
      })
  }

  _setLocalAuth = async (canTouchId: boolean) => {
    const userData: any = await AsyncStorage.getItem('userInfo')
    const infoData: any = JSON.parse(userData)
    const { uniqueId, role, password } = infoData
    
    const userInfo: UserInfo = {
      uniqueId: uniqueId,
      role: role,
      password: password,
      canTouchId: canTouchId
    }

    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))

    Actions.replace('home')
  }
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  passwordContainer: {
    paddingTop: 20 + 44
  },
  thumbItems: {
    width: 8,
    height: 8,
    margin: 2,
    borderRadius: 8
  },
  thumbContainer: {
    width: 38,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  descContainer: {
    height: 158,
    paddingBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  descText: {
    fontFamily: NerveFonts.kr(),
    fontSize: 14,
    marginVertical: 6
  }
})