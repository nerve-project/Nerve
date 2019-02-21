import React, { Component } from 'react'

import Circle from './Circle'

interface Props {
  index: number
  radius: number
  borderWidth: number
  isActive: boolean
  isWarning: boolean
  backgroundColor?: string
  color: string
  activeColor: string
  warningColor: string
  position: {
    left: number
    top: number
  }
}

export default class Point extends Component<Props> {
  _outerCircleRadius: number
  _outerCirclePosition: any
  _innerCircleRadius: number
  _innerCirclePosition: any
  _color: string

  static defaultProps: Partial<Props> = {
    isActive: false,
    isWarning: false
  }

  constructor(props: Props) {
    super(props)

    this._outerCircleRadius = props.radius
    this._outerCirclePosition = props.position
    this._innerCircleRadius = this._outerCircleRadius / 3
    this._innerCirclePosition = {
      left: this._innerCircleRadius * 2 - props.borderWidth,
      top: this._innerCircleRadius * 2 - props.borderWidth
    }
    this._color = this.props.isWarning ? this.props.warningColor : 
                  (this.props.isActive ? this.props.activeColor : this.props.color)
  }

  render(): React.ReactNode {
    return (
      <Circle
        backgroundColor={this.props.backgroundColor}
        color={this._color}
        radius={this.props.radius}
        borderWidth={this.props.borderWidth}
        position={this._outerCirclePosition}
      >
      {(this.props.isActive || this.props.isWarning) ? (
        <Circle 
          isFill={true}
          color={this._color}
          radius={this._innerCircleRadius}
          borderWidth={this.props.borderWidth}
          position={this._innerCirclePosition}
        />
      ) : null}
      </Circle>
    )
  }
}