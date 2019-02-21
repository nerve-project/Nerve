const getLineDistance = (start: any, end: any): number => {
  return Math.sqrt(Math.pow(Math.abs(start.x - end.x), 2) + Math.pow(Math.abs(start.y - end.y), 2))
}

const getLineTransform = (start: any, end: any): any => {
  const distance: number = getLineDistance(start, end)
  let rotateRad: number = Math.acos((end.x - start.x) / distance)

  if (start.y > end.y) {
    rotateRad = Math.PI * 2 - rotateRad
  }

  const translateX = (end.x + start.x) / 2 - start.x - distance / 2
  const translateY = (end.y + start.y) / 2 - start.y

  return { distance, rotateRad, translateX, translateY }
}

const getArrowTransform = (start: any, end: any, width: number, borderWidth: number): any => {
  const distance: number = getLineDistance(start, end)
  let rotateRad: number = Math.acos((end.x - start.x) / distance)

  if (start.y > end.y) {
    rotateRad = Math.PI * 2 - rotateRad
  }

  const origin: any = {
    x: start.x + Math.cos(rotateRad) * width * 2,
    y: start.y + Math.sin(rotateRad) * width * 2
  }

  let translateX = -borderWidth
  let translateY = -borderWidth

  if (start.x == end.x) {
    if (end.y > start.y) {
      translateY = -borderWidth / 2
    } else {
      translateY = -borderWidth * 1.5
    }
  } else if (start.y == end.y) {
    if (end.x > start.x) {
      translateX = -borderWidth / 2
    } else {
      translateX = -borderWidth * 1.5
    }
  } else {
    if (start.x > end.x && start.y > end.y) {
      translateX = -Math.sqrt(Math.pow(borderWidth * 2.5, 2)) / 2
      translateY = -Math.sqrt(Math.pow(borderWidth * 2.5, 2)) / 2
    } else if (start.x > end.x && end.y > start.y) {
      translateX = -Math.sqrt(Math.pow(borderWidth * 2.5, 2)) / 2
      translateY = -Math.sqrt(Math.pow(borderWidth * 1.5, 2)) / 2
    } else if (end.x > start.x && start.y > end.y) {
      translateX = -Math.sqrt(Math.pow(borderWidth * 1.5, 2)) / 2
      translateY = -Math.sqrt(Math.pow(borderWidth * 2.5, 2)) / 2
    } else {
      translateX = -Math.sqrt(Math.pow(borderWidth * 1.5, 2)) / 2
      translateY = -Math.sqrt(Math.pow(borderWidth * 1.5, 2)) / 2
    }
  }

  return { origin, rotateRad, translateX, translateY }
}

const isPointInPath = (location: any, origin: any, radius: number): boolean => {
  return radius > getLineDistance(location, origin)
}

const getCrossPoint = (points: any, lastPoint: any, currentPoint: any, radius: number): any => {
  if (lastPoint.index == 4 || currentPoint.index == 4) {
    return null
  }

  const x1: number = lastPoint.origin.x
  const y1: number = lastPoint.origin.y
  const x2: number = currentPoint.origin.x
  const y2: number = currentPoint.origin.y
  const crossLineLength: number = 6 * radius

  if ((y1 == y2 && Math.abs(x1 - x2) == crossLineLength) 
      || (x1 == x2 && Math.abs(y1 - y2) == crossLineLength)
      || (Math.abs(x1 - x2) == crossLineLength && Math.abs(y1 - y2) == crossLineLength)) {

    const crossPointIndex: number = (lastPoint.index + currentPoint.index) / 2

    return points[crossPointIndex]
  }

  return null
}

const getPassword = (sequence: any): string => {
  return sequence.join('')
}

export default { getLineTransform, getArrowTransform, isPointInPath, getCrossPoint, getPassword }