---
layout: doc
footer: false
---

# Custom Shape Style

Customize shape appearance including border colors, label styles, and auxiliary lines through `shapeOptions`. For full type definitions of `ShapeOptions` and `ShapeAttr`, see [Shape Class API](/en/api/shape-class).

## Customizing Attributes with setAttr

`setAttr` is called on each draw and returns style attributes:

```ts
const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
			shapeOptions: {
				setAttr(shapeInstance) {
					return {
						stroke: {
							color: '#FF0000',
							width: 3,
						},
						fill: 'rgba(255, 0, 0, 0.1)',
						label: {
							font: {
								fill: '#FFFFFF',
								size: 16,
							},
							fill: '#FF0000',
						},
						auxiliary: {
							stroke: {
								color: '#FADC19',
							},
						},
					}
				},
			},
		},
	},
})
```

## Setting Colors by Custom Fields

Use `initDrawFunc` to dynamically set styles based on custom fields in shape data. For example, using a custom `category_id` field to differentiate colors:

```ts
const categoryColors = {
	car: '#FF0000',
	person: '#00FF00',
	building: '#0000FF',
}

const shapeOptions = {
	initDrawFunc(shapeInstance) {
		const categoryId = shapeInstance.data.category_id
		const color = categoryColors[categoryId] || '#FF7D00'

		// Set border color
		shapeInstance.getMainShape()?.stroke({ color })

		// Set label background color
		shapeInstance.getLabelShape()?.find('rect')[0]?.fill(color)
	},
}

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
			shapeOptions,
		},
	},
})
```

## afterRender Callback

`afterRender` is called after the shape DOM is rendered:

```ts
const shapeOptions = {
	afterRender(shapeInstance) {
		console.log('Shape rendered', shapeInstance.data.shapeName)
	},
}
```

## Controlling Edit Behavior

`ShapeOptions` can also control shape editing permissions:

```ts
const shapeOptions = {
	// Control whether editing is allowed
	enableEdit(shapeInstance) {
		return shapeInstance.data.shapeName === 'rect'
	},

	// Control mid-point addition for polyline/polygon editing
	enableEditAddMidPoint(shapeInstance) {
		return true
	},

	// Control vertex deletion for polyline/polygon editing
	enableEditDropPoint(shapeInstance) {
		return true
	},
}
```

