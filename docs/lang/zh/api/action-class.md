---
layout: doc
footer: false
---

# Action 类

Action 类用于`Shape`定义动作，它是所有动作的基类。可以通过继承 Action 类来定义自己的动作。

## 静态属性

### actionName

动作名称，字符串类型。

### actionOptions

```ts
actionOptions: {
	[key: string]: any
} = {}
```

动作选项

## 方法

### destroy

销毁时调用的方法。
