System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var scalarTypes, collectionTypes;
    function isUndefinedOrNull(obj) {
        return typeof obj === 'undefined' || obj === null;
    }
    exports_1("isUndefinedOrNull", isUndefinedOrNull);
    function isType(obj, typeName) {
        return Object.prototype.toString.call(obj) === "[object " + typeName + "]";
    }
    exports_1("isType", isType);
    function isScalar(value) {
        var type = Object.prototype.toString.call(value);
        return scalarTypes.some(function (t) { return t === type; });
    }
    exports_1("isScalar", isScalar);
    function isCollection(value) {
        var type = Object.prototype.toString.call(value);
        return collectionTypes.some(function (t) { return t === type; });
    }
    exports_1("isCollection", isCollection);
    function isObject(value) {
        return (!isUndefinedOrNull(value) && !isScalar(value));
    }
    exports_1("isObject", isObject);
    return {
        setters:[],
        execute: function() {
            scalarTypes = [
                '[object String]',
                '[object Number]',
                '[object Boolean]',
                '[object Date]',
                '[object RegExp]'
            ];
            collectionTypes = [
                '[object Array]',
                '[object Map]',
                '[object WeakMap]',
                '[object Set]',
                '[object WeakSet]'
            ];
        }
    }
});
