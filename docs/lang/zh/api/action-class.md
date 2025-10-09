---
layout: doc
footer: false
---

# Action 类

Action 类用于`Shape`定义动作，它是所有动作的基类。可以通过继承 Action 类来定义自己的动作。

## Types

```ts
export type ActionOptions = {
	[key: string]: any
}
```

## 静态属性

### actionName

动作名称，字符串类型。

### actionOptions

类型：`ActionOptions`

## 方法

### destroy

```ts
// 销毁时调用的方法
destroy(): void
```

### getOptions

```ts
// 获取配置
getOptions<T extends ActionOptions = ActionOptions>(options?: T): T
```

### onContainerMouseMove

```ts
// 容器鼠标移动事件触发
onContainerMouseMove(e: MouseEvent): void
```

### onDocumentMouseMove

```ts
// 文档鼠标移动事件触发
onDocumentMouseMove(e: MouseEvent): void
```

### onDocumentMouseUp

```ts
// 文档鼠标抬起事件触发
onDocumentMouseUp(e: MouseEvent): void
```

### onReadonlyChange

```ts
// 只读状态改变时触发
onReadonlyChange(readonly: boolean): void
```
