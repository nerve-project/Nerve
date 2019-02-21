import React, { Component } from 'react'
import { Alert, AsyncStorage, Platform, StyleSheet, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'

import GesturePassword from '../components/GesturePassword'

import NerveFonts from '../common/NerveFonts'
import NerveSize from '../common/NerveSize'

interface Props {}

interface State {
  isWarning: boolean
  message: string
  messageColor: string
  password: string
  thumbnails: any
}

export default class PatternAuth extends Component<Props, State> {
  _storagePassword: string
  _isAuth: boolean

  constructor(props: Props) {
    super(props)

    this.state = {
      isWarning: false,
      message: '인증패턴을 입력하세요.',
      messageColor: '#A9A9A9',
      password: '',
      thumbnails: []
    }

    this._storagePassword = ''
    this._isAuth = false

    this._loadPassword()
  }

  render(): React.ReactNode {
    return (
      <GesturePassword
        style={styles.container}
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
    )
  }

  _loadPassword = async (): Promise<void> => {
    const userData: any = await AsyncStorage.getItem('userInfo')
    const infoData: any = JSON.parse(userData)
    
    // TODO 패스워드 암호화 해제
    this._storagePassword = infoData.password
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
    if (password === this._storagePassword) {
      Actions.replace('home')
    } else {
      const isWarning: boolean = false
      const message: string = '인증패턴을 다시 입력하세요.'
      const messageColor: string = 'red'

      this.setState({
        isWarning: isWarning,
        message: message,
        messageColor: messageColor,
        password: password
      })

      Alert.alert(
        '패턴인증 실패',
        '인증패턴이 일치하지 않습니다',
        [
          {text: '확인', onPress: () => this._onReset()}
        ],
        {cancelable: false}
      )
    }
  }

  _onReset = (): void => {
    const isWarning = false
    const message = '인증패턴을 입력하세요.'
    const messageColor = '#A9A9A9'

    this.setState({
      isWarning: isWarning,
      message: message,
      messageColor: messageColor
    })
  }
}

const styles: any = StyleSheet.create({
  container: {
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