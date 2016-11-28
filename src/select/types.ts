const scalarTypes = [
    '[object String]',
    '[object Number]',
    '[object Boolean]',
    '[object Date]',
    '[object RegExp]'
];
const collectionTypes = [
    '[object Array]',
    '[object Map]',
    '[object WeakMap]',
    '[object Set]',
    '[object WeakSet]'
];

export function isUndefinedOrNull(obj: any): boolean {
    return typeof obj === 'undefined' || obj === null;
}

export function isType(obj: any, typeName: string): boolean {
    return Object.prototype.toString.call(obj) === `[object ${typeName}]`;
}

export function isScalar(value: any): boolean {
    const type = Object.prototype.toString.call(value);
    return scalarTypes.some((t) => t === type);
}

export function isCollection(value: any): boolean {
    const type = Object.prototype.toString.call(value);
    return collectionTypes.some((t) => t === type);
}

export function isObject(value: any): boolean {
    return (!isUndefinedOrNull(value) && !isScalar(value));
}