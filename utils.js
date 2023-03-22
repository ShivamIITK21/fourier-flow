export const pointCentertoCorner = (point) => {
    return {x:point.x+400, y:400-point.y}
}


// this is used for the data from the backend
export const getMagnitude = (point) => {
    return Math.sqrt(point.X*point.X + point.Y*point.Y)
}

export const getAngle = (point) => {
    return Math.atan2(point.Y, point.X)
}