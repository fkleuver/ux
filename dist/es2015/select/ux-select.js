var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, bindable, ViewResources, processAttributes } from 'aurelia-templating';
import { bindingMode, observable, BindingEngine } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';
import { StyleEngine } from '../styles/style-engine';
import { processDesignAttributes } from '../designs/design-attributes';
import { SelectProperty } from './select-property';
import * as Types from './types';
var nextId = 0;
export var UxSelect = (function () {
    function UxSelect(element, resources, styleEngine, bindingEngine) {
        var _this = this;
        this.resources = resources;
        this.styleEngine = styleEngine;
        this.bindingEngine = bindingEngine;
        this.defaultMatcher = function (a, b) {
            var convert = new SelectProperty();
            return (convert.toView(a, _this.textProperty) === convert.toView(b, _this.textProperty));
        };
        this.matcher = this.defaultMatcher;
        this.theme = null;
        this.options = null;
        this.value = null;
        this.disabled = false;
        this.stopPropagation = false;
        this.id = nextId++;
        this.index = -1;
        this.expanded = false;
        this.isAttached = false;
        this.innerOptions = [];
        this.innerValue = null;
        this.optionsCollectionChanged = function (changeRecords) {
            for (var _i = 0, _a = changeRecords.removed; _i < _a.length; _i++) {
                var removedOption = _a[_i];
                _this.removeOption(removedOption);
            }
            for (var i = 0; i < changeRecords.addedCount; i++) {
                var addedOption = _this.options[changeRecords.index + i];
                _this.addOption(addedOption);
            }
        };
        this.element = element;
    }
    UxSelect.prototype.created = function (_, myView) {
        this.view = myView;
    };
    UxSelect.prototype.bind = function () {
        this.themeChanged(this.theme);
        this.optionsChanged(this.options);
        this.valueChanged(this.value);
    };
    UxSelect.prototype.attached = function () {
        this.isAttached = true;
        if (!this.nativeMode) {
            this.element.setAttribute('tabindex', '0');
        }
    };
    UxSelect.prototype.detached = function () {
        this.isAttached = false;
    };
    UxSelect.prototype.unbind = function () {
        this.innerOptions = [];
        this.innerValue = null;
        if (!Types.isUndefinedOrNull(this.optionsCollectionSubscription)) {
            this.optionsCollectionSubscription.dispose();
            this.optionsCollectionSubscription = null;
        }
    };
    UxSelect.prototype.themeChanged = function (newValue) {
        if (!Types.isUndefinedOrNull(newValue)) {
            this.styleEngine.applyTheme(this, newValue);
        }
    };
    UxSelect.prototype.optionsChanged = function (newValue) {
        if (!Types.isUndefinedOrNull(this.optionsCollectionSubscription)) {
            this.optionsCollectionSubscription.dispose();
            this.optionsCollectionSubscription = null;
        }
        this.innerOptions = [];
        if (Types.isUndefinedOrNull(newValue)) {
            return;
        }
        if (!Types.isCollection(newValue)) {
            throw new Error('\'options\' must be a collection type');
        }
        this.optionsCollectionSubscription = this.bindingEngine
            .collectionObserver(this.options)
            .subscribe(this.optionsCollectionChanged);
        for (var _i = 0, newValue_1 = newValue; _i < newValue_1.length; _i++) {
            var option = newValue_1[_i];
            this.addOption(option);
        }
    };
    UxSelect.prototype.valueChanged = function (newValue) {
        if (this.innerValue !== newValue) {
            this.innerValue = newValue;
        }
    };
    UxSelect.prototype.innerValueChanged = function (newValue) {
        var _this = this;
        if (this.isAttached && this.value !== newValue) {
            this.value = newValue;
        }
        var innerOption = this.innerOptions.find(function (x) { return _this.matcher(x, newValue); });
        this.index = this.innerOptions.indexOf(innerOption);
    };
    UxSelect.prototype.addOption = function (option) {
        if (Types.isScalar(option)) {
            var wrappedOption = {};
            wrappedOption[this.textProperty] = option.toString();
            this.innerOptions.push(wrappedOption);
        }
        else {
            this.innerOptions.push(option);
        }
    };
    UxSelect.prototype.removeOption = function (option) {
        var _this = this;
        var innerOption = this.innerOptions.find(function (x) { return _this.matcher(x, option); });
        var idx = this.innerOptions.indexOf(innerOption);
        this.innerOptions.splice(idx);
    };
    UxSelect.prototype.select = function (option) {
        this.innerValue = option;
        this.expanded = false;
    };
    UxSelect.prototype.inputClick = function () {
        this.expanded = !this.expanded;
        return !this.stopPropagation;
    };
    UxSelect.prototype.selectBlur = function () {
        this.expanded = false;
    };
    __decorate([
        bindable({ defaultBindingMode: bindingMode.oneTime, defaultValue: true })
    ], UxSelect.prototype, "nativeMode", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.oneTime })
    ], UxSelect.prototype, "matcher", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.oneTime, defaultValue: 'text' })
    ], UxSelect.prototype, "textProperty", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.oneWay })
    ], UxSelect.prototype, "theme", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.oneWay })
    ], UxSelect.prototype, "options", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay })
    ], UxSelect.prototype, "value", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.oneWay })
    ], UxSelect.prototype, "disabled", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.oneWay })
    ], UxSelect.prototype, "stopPropagation", void 0);
    __decorate([
        observable
    ], UxSelect.prototype, "innerValue", void 0);
    UxSelect = __decorate([
        inject(DOM.Element, ViewResources, StyleEngine, BindingEngine),
        customElement('ux-select'),
        processAttributes(processDesignAttributes)
    ], UxSelect);
    return UxSelect;
}());
