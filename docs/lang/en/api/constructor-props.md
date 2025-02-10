---
layout: doc
footer: false
---

## Static Properties

### pluginList

A list of all currently registered plugins

## Instance Properties

### id

A unique identifier for the current instance

### container

The container element of the current instance

### containerRectInfo

The rectangle information of the container element of the current instance

### stage

The stage object of the current instance

### stageGroup

The stage group object of the current instance

### image

The Svg.js image object of the current instance

### imageDom

The image DOM element of the current instance

### plugin

The plugin object of the current instance

### status

```ts
export type ImageMarkStatus = {
	scaling: boolean
	moving: boolean
	drawing: boolean | string //string when it is shapeName
}
```

The status of the current instance

### minScale

The minimum scale ratio of the current instance

### maxScale

The maximum scale ratio of the current instance

### movingStartPoint

The starting point of the canvas move for the current instance

### eventBus

The event bus object of the current instance

### createTime

The creation time of the current instance

### movingStartTransform

The transformation matrix at the start of the canvas move for the current instance
