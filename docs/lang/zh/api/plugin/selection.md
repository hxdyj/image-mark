---
layout: doc
footer: false
---

# Selection Plugin

选中插件，配套 selection action 一起使用，单独使用插件的时候，插件会给每个 shape 上边注册 selection action。

## 静态属性

### pluginName

`selection`

## 实例属性

### selectShapeList

选中的 shape 列表

## 实例方法

### mode

```ts
export type SelectionType = 'single' | 'multiple'
```

参数：`(newMode?: SelectionType)`

切换多选单选模式
