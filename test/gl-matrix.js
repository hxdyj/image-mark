import { mat3 } from 'gl-matrix'


function angle2rad(angle) {
	return angle * Math.PI / 180;
}

function calculateRotateInfo(angle) {
	const rad = angle2rad(angle);
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	return { cos, sin };
}


function log(arr) {
	console.log(`
-------------------------------
${arr[0]} ${arr[1]} ${arr[2]}
${arr[3]} ${arr[4]} ${arr[5]}
${arr[6]} ${arr[7]} ${arr[8]}
-------------------------------
matrix(${arr[0]},${arr[3]},${arr[1]},${arr[4]},${arr[2]},${arr[5]})
-------------------------------
`)
}

const { cos, sin } = calculateRotateInfo(45)

// console.log(`
// ${cos} -${sin} 0
// ${sin} ${cos} 0
// 0 0 1
// `)

const rotate_45deg_by_50_100_point = mat3.multiply(
	[],
	mat3.multiply(
		[],
		[
			1, 0, -50,
			0, 1, -100,
			0, 0, 1
		],
		[
			cos, -sin, 0,
			sin, cos, 0,
			0, 0, 1
		]
	),
	[
		1, 0, 50,
		0, 1, 100,
		0, 0, 1
	],
)



const rotate_90deg_by_50_100_point = mat3.multiply(
	[],
	mat3.multiply(
		[],
		mat3.multiply(
			[],
			rotate_45deg_by_50_100_point,
			[
				1, 0, -50,
				0, 1, -100,
				0, 0, 1
			]
		),
		[
			cos, -sin, 0,
			sin, cos, 0,
			0, 0, 1
		]
	),
	[
		1, 0, 50,
		0, 1, 100,
		0, 0, 1
	],
)

log(
	rotate_45deg_by_50_100_point
)
log(
	rotate_90deg_by_50_100_point
)
