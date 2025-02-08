---
layout: doc
footer: false
---

## Static Methods

### usePlugin

Use a plugin

### unusePlugin

Unuse a plugin

### hasPlugin

Check if a plugin is in use

### useDefaultPlugin

Use default plugins, which include the built-in [`shape`](/en/api/plugin/shape) and [`selection`](/en/api/plugin/selection) plugins

### unuseDefaultPlugin

Unuse default plugins

## Instance Methods

### resize

Triggered when the container size changes

### rerender

Triggered when re-rendering

### destroy

Destroy the instance

### addDefaultAction

Add default actions to the instance, currently including canvas zooming and moving

### removeDefaultAction

Remove default actions from the instance

### addStageLmbDownMoveing

Add canvas moving

### removeStageLmbDownMoveing

Remove canvas moving

### addStageMouseScale

Add canvas zooming

### removeStageMouseScale

Remove canvas zooming

### moveTo

params: `(position: Position)`

```ts
type Position =
	| 'left-top'
	| 'right-top'
	| 'left-bottom'
	| 'right-bottom'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'center'
```

Move to a specified position

### move

params: `(point: ArrayPoint)`

```ts
export type ArrayPoint = [number, number]
```

Move to specified coordinates

### startSuccessiveMove

params: `(point: ArrayPoint)`

Start successive moving

### moveSuccessive

params: `(point: ArrayPoint)`

Successive moving

### endSuccessiveMove()

Stop successive moving

### scale

params: (

- direction: 1 | -1, `1 for zoom-in, -1 for zoom-out`
- point: ArrayPoint | 'left-top' | 'center', `zoom-in point`
- reletiveTo: 'container' | 'image' = 'container', `relative to whom`
- newScale?: number `new scaling ratio, if provided, scale directly to this ratio`

  )

### scaleTo

params: (

- options: [ImageMarkOptions['initScaleConfig']](/en/api/constructor-options#initscaleconfig),
- point: ArrayPoint | 'left-top' | 'center', `zoom-in point`
- reletiveTo: 'container' | 'image' = 'container' `relative to whom`

)

### setMinScale

```ts
export type InitialScaleSize = 'fit' | 'original' | 'width' | 'height' | 'cover'
```

params: `(minScale: number|InitialScaleSize)`

Set minimum scaling ratio

### setMaxScale

params: `(minScale: number|InitialScaleSize)`

Set maximum scaling ratio

### on

params: (...rest: any) `参考 eventemitter3 的 on 方法`

Bind instance events, currently refer to the [events](/en/api/constructor-on) documentation for events that can be listened to by the instance

### off

params: (...rest: any) `参考 eventemitter3 的 off 方法`

Unbind instance events

### setEnableImageOutOfContainer

params: `(enable: boolean)`

Set whether the image can be out of the container

### initPlugin

```ts
export type PluginNewCall = (imageMarkInstance: ImageMark) => Plugin
```

params: `(plugin: typeof Plugin|PluginNewCall)`

Initialize a plugin

### addPlugin

params: `(plugin: typeof Plugin|PluginNewCall)`

Add a plugin to the instance, currently has the same effect as `initPlugin`

### removePlugin

params: `(plugin: typeof Plugin)`

Remove a plugin from the instance

### getShapePlugin

Get the `shape plugin` instance on the instance

### getSelectionPlugin

Get the `selection plugin` instance on the instance
