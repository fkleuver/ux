var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, bindable, ViewResources, ViewSlot, ViewCompiler, processAttributes } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { TaskQueue } from 'aurelia-task-queue';
import { inject, Container } from 'aurelia-dependency-injection';
import { StyleEngine } from '../styles/style-engine';
import { processDesignAttributes } from '../designs/design-attributes';
export var UxOption = (function () {
    function UxOption(tq, resources, styleEngine, container, viewCompiler, viewSlot) {
        this.tq = tq;
        this.resources = resources;
        this.styleEngine = styleEngine;
        this.container = container;
        this.viewCompiler = viewCompiler;
        this.viewSlot = viewSlot;
        this.theme = null;
        this.option = null;
        this.html = null;
        this.selected = false;
        this.isApplied = false;
        this.isAttached = false;
    }
    UxOption.prototype.created = function (_, myView) {
        this.view = myView;
    };
    UxOption.prototype.bind = function (bindingContext, overrideContext) {
        this.bindingContext = bindingContext;
        this.overrideContext = overrideContext;
    };
    UxOption.prototype.attached = function () {
        var _this = this;
        this.isAttached = true;
        this.tq.queueMicroTask(function () {
            _this.apply();
            if (!_this.html) {
                _this.htmlChanged(_this.html);
            }
        });
    };
    UxOption.prototype.detached = function () {
        this.isAttached = false;
    };
    UxOption.prototype.unbind = function () {
        this.disposeView();
        this.bindingContext = null;
        this.overrideContext = null;
    };
    UxOption.prototype.themeChanged = function (newValue) {
        if (newValue) {
            this.styleEngine.applyTheme(this, newValue);
        }
    };
    UxOption.prototype.htmlChanged = function (newValue) {
        if (newValue) {
            if (this.isAttached) {
                this.apply();
            }
        }
        else {
            // TODO: get the binding from UxSelect.innerTemplateHTML to UxOption.html to work and remove this
            var itemTemplate = this.overrideContext
                .parentOverrideContext
                .bindingContext
                .itemTemplate;
            if (itemTemplate.innerHTML.trim() !== '<!--slot-->') {
                this.html = itemTemplate.innerHTML;
            }
            else if (this.isApplied) {
                this.disposeView();
                this.html = null;
            }
        }
    };
    UxOption.prototype.apply = function () {
        if (this.isApplied) {
            this.disposeView();
        }
        this.compileView();
    };
    UxOption.prototype.disposeView = function () {
        if (this.viewSlot) {
            this.viewSlot.unbind();
            this.viewSlot.detached();
            this.viewSlot.removeAll();
        }
        if (this.innerViewFactory) {
            this.innerViewFactory = null;
        }
        if (this.innerView) {
            this.innerView = null;
        }
        this.isApplied = false;
    };
    UxOption.prototype.compileView = function () {
        this.innerViewFactory = createViewFactory(this.viewCompiler, this.container, this.html);
        this.innerView = createView(this.innerViewFactory, this.container);
        this.viewSlot.add(this.innerView);
        this.viewSlot.bind(this.bindingContext, this.overrideContext);
        this.viewSlot.attached();
        this.isApplied = true;
    };
    __decorate([
        bindable
    ], UxOption.prototype, "theme", void 0);
    __decorate([
        bindable
    ], UxOption.prototype, "option", void 0);
    __decorate([
        bindable
    ], UxOption.prototype, "html", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.oneTime, defaultValue: 'text' })
    ], UxOption.prototype, "textProperty", void 0);
    __decorate([
        bindable
    ], UxOption.prototype, "selected", void 0);
    UxOption = __decorate([
        inject(TaskQueue, ViewResources, StyleEngine, Container, ViewCompiler, ViewSlot),
        customElement('ux-option'),
        processAttributes(processDesignAttributes)
    ], UxOption);
    return UxOption;
}());
function createViewFactory(viewCompiler, container, html) {
    if (!html || !html.startsWith('<template>')) {
        html = "<template>" + html + "</template>";
    }
    var viewResources = container.get(ViewResources);
    var viewFactory = viewCompiler.compile(html, viewResources);
    return viewFactory;
}
function createView(viewFactory, container) {
    var childContainer = container.createChild();
    var view = viewFactory.create(childContainer);
    return view;
}
