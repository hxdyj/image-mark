---
layout: doc
footer: false
---

# Plugin 类

各种插件的基类，可以继承该类实现自定义插件。

## Types

```ts
export type PluginOptions = {
	[key: string]: any
}
```

## 构造函数

### constructor

```ts
//构造函数，传入 ImageMark 实例
constructor(imageMark: ImageMark, pluginOptions?: PluginOptions): void
```

## 静态属性

### pluginName

插件名称，字符串类型，必填项

### pluginOptions

插件配置

## 实例属性

### imageMark

插件所属的 ImageMark 实例

## 方法

### getOptions

```ts
getOptions<T extends PluginOptions = PluginOptions>(options?: T, dealPluginOptions?: (options: T) => T): T
```

### onReadonlyChange

```ts
//只读状态改变时调用
onReadonlyChange(readonly: boolean): void
```

### destroy

```ts
//销毁插件实例
destroy():void
```
