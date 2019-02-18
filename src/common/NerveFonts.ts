const kr = (weight: string = 'normal') => {
  if (weight === 'bold') {
    return 'Sunflower-Medium'
  }
  
  return 'Sunflower-Light'
}

const en = (weight: string = 'normal') => {
  if (weight === 'bold') {
    return 'Comfortaa-Bold'
  }
    
  return 'Comfortaa-Regular'
}

export default { kr, en }