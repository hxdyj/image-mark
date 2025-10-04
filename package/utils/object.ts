

export function setObjectNewValue<T extends object = object>(obj: T, newValue: T): T {
	if (obj === newValue) return obj
	// 只删除自有属性，保留原型链上的属性
	Object.getOwnPropertyNames(obj).forEach(key => {
		//@ts-ignore
		delete obj[key];
	});
	Object.assign(obj, newValue)
	return obj
}
