import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

interface Props {
  isFill?: boolean
  color: string
  radius: number
  borderWidth: number
  backgroundColor?: string
  position: {
    left: number
    top: number
  }
}

export default class Circle extends Component<Props> {
  _diameter: number

  static defaultProps: Partial<Props> = {
    isFill: false,
    backgroundColor: 'transparent'
  }

  constructor(props: Props) {
    super(props)

    this._diameter = props.radius * 2
  }

  render(): React.ReactNode {
    return (
      <View
        style={[
          styles.container, 
          this.props.isFill ? {backgroundColor: this.props.color} :
          {borderColor: this.props.color, borderWidth: this.props.borderWidth, backgroundColor: this.props.backgroundColor},
          {
            width: this._diameter,
            height: this._diameter,
            borderRadius: this.props.radius,
            left: this.props.position.left,
            top: this.props.position.top
          }
        ]}
      >
        {this.props.children}
      </View>
    )
  }
}

const styles: any = StyleSheet.create({
  container: {
    position: 'absolute'
  }
})