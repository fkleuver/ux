var scalarTypes = [
    '[object String]',
    '[object Number]',
    '[object Boolean]',
    '[object Date]',
    '[object RegExp]'
];
var collectionTypes = [
    '[object Array]',
    '[object Map]',
    '[object WeakMap]',
    '[object Set]',
    '[object WeakSet]'
];
export function isUndefinedOrNull(obj) {
    return typeof obj === 'undefined' || obj === null;
}
export function isType(obj, typeName) {
    return Object.prototype.toString.call(obj) === "[object " + typeName + "]";
}
export function isScalar(value) {
    var type = Object.prototype.toString.call(value);
    return scalarTypes.some(function (t) { return t === type; });
}
export function isCollection(value) {
    var type = Object.prototype.toString.call(value);
    return collectionTypes.some(function (t) { return t === type; });
}
export function isObject(value) {
    return (!isUndefinedOrNull(value) && !isScalar(value));
}
