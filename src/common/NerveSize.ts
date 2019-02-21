import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const deviceWidth = (): number => {
  return width
}

const deviceHeight = (): number => {
  return height
}

export default { deviceWidth, deviceHeight }