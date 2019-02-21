import React, { Component } from 'react'
import { GestureResponderEvent, PanResponder, PanResponderGestureState, PanResponderInstance, StyleSheet, View } from 'react-native'

import NerveSize from '../../common/NerveSize'
import NerveUtils from '../../common/NerveUtils'

import Line from './Line'
import Point from './Point'
import Arrow from './Arrow'

const padding: number = 8
const borderWidth: number = 1

const deviceWidth: number = NerveSize.deviceWidth()

interface Props {
  style?: React.CSSProperties
  lineWidth?: number
  pointBackgroundColor?: string
  gestureAreaLength?: number
  color?: string
  lineColor?: string
  activeColor?: string
  warningColor?: string
  warningDuration?: number
  topComponent?: React.ReactNode
  bottomComponent?: React.ReactNode
  isWarning?: boolean
  showArrow?: boolean
  allowCross?: boolean
  onStart?: Function
  onReset?: Function
  onFinish?: Function
}

interface State {
  isWarning: boolean
  points: any
  lines: any
  arrows: any
}

export default class GesturePassword extends Component<Props, State> {
  _gestureAreaMarginHorizontal: number
  _gestureAreaLeft: number
  _gestureAreaTop: number
  _pointRadius: number
  _currentPoint: any
  _currentLine: any
  _timer: any
  _sequence: any
  _panResponder: any

  static defaultProps: Partial<Props> = {
    lineWidth: 5,
    pointBackgroundColor: 'transparent',
    gestureAreaLength: 222,
    color: '#A9A9A9',
    activeColor: '#00AAEF',
    warningColor: 'red',
    warningDuration: 0,
    isWarning: false,
    showArrow: true,
    allowCross: true,
  }
  
  constructor(props: Props) {
    super(props)

    this.state = {
      isWarning: false,
      points: [],
      lines: [],
      arrows: []
    }

    this._gestureAreaMarginHorizontal = (deviceWidth - props.gestureAreaLength!) / 2
    this._gestureAreaLeft = 0
    this._gestureAreaTop = 0
    this._pointRadius = (props.gestureAreaLength! - padding * 2) / 8
    this._currentPoint = null
    this._currentLine = null
    this._timer = null
    this._sequence = []
  }

  componentWillMount(): void {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (): boolean => true,
      onMoveShouldSetPanResponder: (): boolean => true,
      onPanResponderGrant: this._onTouchStart,
      onPanResponderMove: this._onTouchMove,
      onPanResponderRelease: this._onTouchEnd,
      onPanResponderTerminationRequest: (): boolean => false
    })
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({
      isWarning: nextProps.isWarning!
    })
  }

  render(): React.ReactNode {
    return(
      <View style={[this.props.style, styles.container]}>
        {this.props.topComponent}
        <View
          {...this._panResponder.panHandlers}
          onLayout={this._onLayout}
          style={{
            overflow: 'hidden',
            width: this.props.gestureAreaLength,
            height: this.props.gestureAreaLength,
            marginHorizontal: this._gestureAreaMarginHorizontal
          }}
        >
          {this._renderLines()}
          {this._renderPoints()}
          {this.props.showArrow ? this._renderArrows() : null}
        </View>
        {this.props.bottomComponent}
      </View>
    )
  }

  componentWillUnmount(): void {
    if (this._timer != null) {
      clearTimeout(this._timer)
      this._timer = null
    }
  }

  _onTouchStart = (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
    if (this.props.onStart) {
      this.props.onStart
    }

    if (this._timer != null) {
      clearTimeout(this._timer)
      this._timer = null
    }

    this._reset()

    const location: any = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY
    }
    const point = this._getTouchPoint(location)

    if (point == null) {
      return
    }

    this._addSequence(point.index)
    this._setToActive(point)
    this._currentPoint = point
  }

  _onTouchMove = (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
    const location: any = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY
    }
    const point: any = this._getTouchPoint(location)

    if (point == null) {
      if (this._currentLine == null) {
        return
      }

      this._updateLine(this._currentPoint.origin, location)
    } else {
      if (this._currentLine == null) {
        const line: any = {
          start: point.origin,
          end: location,
          color: this.props.lineColor || this.props.activeColor
        }

        this._addLine(line)
        this._currentLine = line

        if (this._currentPoint != null) {
          return
        }

        this._addSequence(point.index)
        this._setToActive(point)
        this._currentPoint = point
      } else {
        if (point === this._currentPoint) {
          this._updateLine(point.origin, location)
          
          return
        }

        if (this._sequence.includes(point.index)) {
          this._updateLine(this._currentPoint.origin, location)

          return
        }

        if (!this.props.allowCross) {
          const crossPoint: any = NerveUtils.getCrossPoint(this.state.points, this._currentPoint, point, this._pointRadius)

          if (crossPoint != null) {
            this._addSequence(crossPoint.index)
            this._setToActive(crossPoint)
          }
        }

        this._updateLine(this._currentPoint.origin, point.origin)

        const arrow: any = {
          start: this._currentPoint.origin,
          end: point.origin,
          color: this.props.activeColor
        }

        this._addArrow(arrow)

        const line: any = {
          start: point.origin,
          end: location,
          color: this.props.lineColor || this.props.activeColor
        }

        this._addLine(line)
        this._currentLine = line

        this._addSequence(point.index)
        this._setToActive(point)
        this._currentPoint = point
      }
    }
  }

  _onTouchEnd = (e: GestureResponderEvent, gestureState: PanResponderGestureState): void  => {
    if (this._sequence.length == 0) {
      return
    }

    const points = this.state.points
    const lines = this.state.lines

    lines.pop()

    this.setState({
      lines: lines,
      points:points
    })

    const password: string = NerveUtils.getPassword(this._sequence)

    if (this.props.onFinish) {
      this.props.onFinish(password)
    }

    if (this.props.warningDuration! > 0) {
      this._timer = setTimeout(() => {
        this._reset()
      }, this.props.warningDuration)
    } else {
      this._reset()
    }
  }

  _renderLines = (): React.ReactNode => {
    return this.state.lines.map((line: any, index: number) => {
      if (this.state.isWarning) {
        line.color = this.props.warningColor
      }

      return (
        <Line 
          key={`line-${index}`}
          color={line.color}
          lineWidth={this.props.lineWidth}
          start={{
            x: line.start.x - this._gestureAreaLeft,
            y: line.start.y - this._gestureAreaTop
          }}
          end={{
            x: line.end.x - this._gestureAreaLeft,
            y: line.end.y - this._gestureAreaTop
          }}
        />
      )
    })
  }

  _renderPoints = (): React.ReactNode => {
    return this.state.points.map((point: any, index: number) => {
      return (
        <Point 
          key={`point-${index}`}
          radius={this._pointRadius}
          borderWidth={borderWidth}
          backgroundColor={this.props.pointBackgroundColor}
          color={this.props.color}
          activeColor={this.props.activeColor}
          warningColor={this.props.warningColor}
          isActive={point.isActive}
          isWarning={point.isActive ? this.state.isWarning : false}
          index={point.index}
          position={point.position}
        />
      )
    })
  }

  _renderArrows = (): React.ReactNode => {
    return this.state.arrows.map((arrow: any, index: number) => {
      if (this.state.isWarning) {
        arrow.color = this.props.warningColor
      }

      return (
        <Arrow
          key={`arrow-${index}`}
          width={this._pointRadius / 3}
          color={arrow.color}
          start={{
            x: arrow.start.x - this._gestureAreaLeft,
            y: arrow.start.y - this._gestureAreaTop
          }}
          end={{
            x: arrow.end.x - this._gestureAreaLeft,
            y: arrow.end.y - this._gestureAreaTop
          }}
        />
      )
    })
  }

  _onLayout = (e: any): void => {
    e.persist()

    this._gestureAreaLeft = e.nativeEvent.layout.x
    this._gestureAreaTop = e.nativeEvent.layout.y
    
    this._initializePoints()
  }

  _initializePoints = (): void => {
    if(this.state.points.length) {
      return
    }

    let points: any = []
    
    for (let i: number = 0; i < 9; i++) {
      const left: number = this._pointRadius * 3 * (i % 3) + padding
      const top: number = this._pointRadius * 3 * Math.floor(i / 3) + padding

      points.push({
        index: i,
        position: {
          left: left,
          top: top
        },
        origin: {
          x: this._gestureAreaLeft + left + this._pointRadius,
          y: this._gestureAreaTop + top + this._pointRadius
        },
        isActive: false,
        isWarning: false
      })
    }

    this.setState({
      points: points
    })
  }

  _reset = (): void => {
    const points = this.state.points.map((point: any, index: number) => {
      point.isActive = false
      return point
    })

    this.setState({
      isWarning: false,
      points: points,
      lines: [],
      arrows: []
    })

    this._sequence = []
    this._currentPoint = null
    this._currentLine = null

    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  _getTouchPoint = (location: any): any => {
    for (let point of this.state.points) {
      if (NerveUtils.isPointInPath(location, point.origin, this._pointRadius)) {
        return point
      }
    }

    return null
  }

  _addSequence = (index: number): void => {
    if (this._sequence.includes(index)) {
      return
    }

    this._sequence.push(index)
  }

  _setToActive = (point: any): void => {
    point.isActive = true

    this.setState({
      points: this.state.points
    })
  }

  _updateLine = (start: any, end: any): void => {
    this._currentLine.start = start
    this._currentLine.end = end

    const lines = this.state.lines

    this.setState({
      lines: lines
    })
  }

  _addLine = (line: any): void => {
    this.state.lines.push(line)

    const lines = this.state.lines

    this.setState({
      lines: lines
    })
  }

  _addArrow = (arrow: any): void => {
    this.state.arrows.push(arrow)

    const arrows = this.state.arrows

    this.setState({
      arrows: arrows
    })
  }
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  }
})