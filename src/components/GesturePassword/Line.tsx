import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import NerveUtils from '../../common/NerveUtils'

interface Props {
  color: string
  lineWidth?: number
  start: {
    x: number
    y: number
  }
  end: {
    x: number
    y: number
  }
}

export default class Line extends Component<Props> {
  
  render(): React.ReactNode {
    const transform: any = NerveUtils.getLineTransform(this.props.start, this.props.end)
    
    return (
      <View
        style={[styles.container, {
          backgroundColor: this.props.color,
          width: transform.distance,
          height: this.props.lineWidth,
          left: this.props.start.x,
          top: this.props.start.y - this.props.lineWidth! / 2,
          transform: [
            {translateX: transform.translateX},
            {translateY: transform.translateY},
            {rotateZ: transform.rotateRad + 'rad'}
          ]
        }]}
      />
    )
  }
}

const styles: any = StyleSheet.create({
  container: {
    position: 'absolute'
  }
})