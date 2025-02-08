---
layout: doc
footer: false
---

# Action Class

The Action class is used to define actions for `Shape`, and it serves as the base class for all actions. You can define your own actions by inheriting from the Action class.

## Static Properties

### actionName

The name of the action, a string type.

### actionOptions

```ts
actionOptions: {
	[key: string]: any
} = {}
```

Action options.

## Methods

### destroy

The method called when the action is destroyed.
