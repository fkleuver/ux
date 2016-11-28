var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { valueConverter } from 'aurelia-binding';
import * as Types from './types';
export var SelectProperty = (function () {
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
        valueConverter('selectProperty')
    ], SelectProperty);
    return SelectProperty;
}());
