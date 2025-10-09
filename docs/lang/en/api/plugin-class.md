---
layout: doc
footer: false
---

# Plugin Class

The base class for various plugins, which can be inherited to implement custom plugins.

## Types

```ts
export type PluginOptions = {
	[key: string]: any
}
```

## Constructor

### constructor

```ts
// The constructor, which takes an ImageMark instance and optional plugin options
constructor(imageMark: ImageMark, pluginOptions?: PluginOptions): void
```

## Static Properties

### pluginName

The name of the plugin, string type, required.

### pluginOptions

Plugin configuration

## Instance Properties

### imageMark

The ImageMark instance to which the plugin belongs.

## Methods

### getOptions

```ts
getOptions<T extends PluginOptions = PluginOptions>(options?: T, dealPluginOptions?: (options: T) => T): T
```

### onReadonlyChange

```ts
// Called when the readonly state changes
onReadonlyChange(readonly: boolean): void
```

### destroy

```ts
// Destroys the plugin instance
destroy():void
```
