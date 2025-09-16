---
layout: doc
footer: false
---

# Plugin Class

The base class for various plugins, which can be inherited to implement custom plugins.

## Constructor

### constructor

```ts
// The constructor, which takes an ImageMark instance as a parameter.
constructor(imageMark: ImageMark): void
```

## Static Properties

### pluginName

The name of the plugin, string type, required.

## Instance Properties

### imageMark

The ImageMark instance to which the plugin belongs.

## Methods

### destroy

```ts
//Destroys the plugin instance.
destroy():void
```
