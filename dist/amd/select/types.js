define(["require", "exports"], function (require, exports) {
    "use strict";
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
    function isUndefinedOrNull(obj) {
        return typeof obj === 'undefined' || obj === null;
    }
    exports.isUndefinedOrNull = isUndefinedOrNull;
    function isType(obj, typeName) {
        return Object.prototype.toString.call(obj) === "[object " + typeName + "]";
    }
    exports.isType = isType;
    function isScalar(value) {
        var type = Object.prototype.toString.call(value);
        return scalarTypes.some(function (t) { return t === type; });
    }
    exports.isScalar = isScalar;
    function isCollection(value) {
        var type = Object.prototype.toString.call(value);
        return collectionTypes.some(function (t) { return t === type; });
    }
    exports.isCollection = isCollection;
    function isObject(value) {
        return (!isUndefinedOrNull(value) && !isScalar(value));
    }
    exports.isObject = isObject;
});
