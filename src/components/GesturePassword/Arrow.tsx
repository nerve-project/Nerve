import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import NerveUtils from '../../common/NerveUtils'

interface Props {
  start: {
    x: number
    y: number
  }
  end: {
    x: number
    y: number
  }
  width: number
  color: string
}

export default class Arrow extends Component<Props> {
  _borderWidth: number
  _transform: any
  
  constructor(props: Props) {
    super(props)

    this._borderWidth = props.width / 3 * 2
    this._transform = NerveUtils.getArrowTransform(props.start, props.end, props.width, this._borderWidth)
  }

  render(): React.ReactNode {
    return (
      <View
        style={[styles.container, {
          borderWidth: this._borderWidth,
          borderLeftColor: this.props.color,
          borderRightColor: 'transparent',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          left: this._transform.origin.x,
          top: this._transform.origin.y,
          transform: [
            {translateX: this._transform.translateX},
            {translateY: this._transform.translateY},
            {rotateZ: this._transform.rotateRad + 'rad'}
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