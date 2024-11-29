import { Matrix2D } from "../package/utils/matrix2d";
import { Matrix2D1 } from "../package/utils/matrix2d1";
import { ScreenMatrix2D } from "../package/utils/screenMatrix2d";
import { Matrix } from '@svgdotjs/svg.js'
// new ScreenMatrix2D().rotateAroundPoint(45, 50, 100).log().rotateAroundPoint(45, 50, 100).log()
new Matrix2D1()
	.rotateAroundPoint(45, 50, 100)
	.log()
// new Matrix2D()
// 	.rotateAroundPoint(45, 50, 100)
// .rotateAroundPoint(-45, 50, 100)
// .rotateAroundPoint(-45, 50, 100)
// .rotateAroundPoint(-45, 50, 100)
// .log()

// new ScreenMatrix2D()
// 	.rotateAroundPoint(45, 50, 100)
// 	// .rotateAroundPoint(-45, 50, 100)
// 	.log()


// const a = new Matrix().translate(-50, -100).rotate(45).translate(50, 100)
// const b = new Matrix().transform({
// 	rotate: 45,
// 	origin: [50, 100]
// })
// console.log(a)
// console.log(b)
