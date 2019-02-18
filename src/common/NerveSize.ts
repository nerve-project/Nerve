import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const deviceWidth = () => {
  return width
}

const deviceHeight = () => {
  return height
}

export default { deviceWidth, deviceHeight }