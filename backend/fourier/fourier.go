package fourier

import "math"

type Point struct {
	X float64
	Y float64
}

func GetInitialConds(points []Point, n int) []Point {
	var initials []Point
	for i := -1 * (n / 2); i <= n/2; i++ {
		p := nthFourierCoeff(points, i)
		initials = append(initials, p)
	}
	return initials
}

func nthFourierCoeff(points []Point, n int) Point {
	var xval float64 = 0
	var yval float64 = 0
	for i := 0; i < len(points); i++ {
		sin_val, cos_val := math.Sincos((2.0 * math.Pi * float64(n) * float64(i)) / float64(len(points)))
		xval += (cos_val * points[i].X)
		xval += (sin_val * points[i].Y)
		yval += (cos_val * points[i].Y)
		yval -= (sin_val * points[i].X)
	}

	var ret Point
	ret.X = xval / float64(len(points))
	ret.Y = yval / float64(len(points))

	return ret
}
