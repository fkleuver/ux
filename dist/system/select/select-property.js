System.register(['aurelia-binding', './types'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var aurelia_binding_1, Types;
    var SelectProperty;
    return {
        setters:[
            function (aurelia_binding_1_1) {
                aurelia_binding_1 = aurelia_binding_1_1;
            },
            function (Types_1) {
                Types = Types_1;
            }],
        execute: function() {
            SelectProperty = (function () {
                function SelectProperty() {
                }
                SelectProperty.prototype.toView = function (obj, prop, placeholder) {
                    if (placeholder === void 0) { placeholder = ' - '; }
                    var fallback = Types.isUndefinedOrNull(placeholder) ? null : placeholder.toString();
                    var retVal;
                    if (Types.isObject(obj) && Types.isType(prop, 'String')) {
                        retVal = obj[prop];
                    }
                    else {
                        retVal = obj;
                    }
                    if (Types.isUndefinedOrNull(retVal)) {
                        return fallback;
                    }
                    return retVal.toString();
                };
                SelectProperty = __decorate([
                    aurelia_binding_1.valueConverter('selectProperty')
                ], SelectProperty);
                return SelectProperty;
            }());
            exports_1("SelectProperty", SelectProperty);
        }
    }
});
