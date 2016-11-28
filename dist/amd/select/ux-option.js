var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", 'aurelia-templating', 'aurelia-binding', 'aurelia-task-queue', 'aurelia-dependency-injection', '../styles/style-engine', '../designs/design-attributes'], function (require, exports, aurelia_templating_1, aurelia_binding_1, aurelia_task_queue_1, aurelia_dependency_injection_1, style_engine_1, design_attributes_1) {
    "use strict";
    var UxOption = (function () {
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
            aurelia_templating_1.bindable
        ], UxOption.prototype, "theme", void 0);
        __decorate([
            aurelia_templating_1.bindable
        ], UxOption.prototype, "option", void 0);
        __decorate([
            aurelia_templating_1.bindable
        ], UxOption.prototype, "html", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneTime, defaultValue: 'text' })
        ], UxOption.prototype, "textProperty", void 0);
        __decorate([
            aurelia_templating_1.bindable
        ], UxOption.prototype, "selected", void 0);
        UxOption = __decorate([
            aurelia_dependency_injection_1.inject(aurelia_task_queue_1.TaskQueue, aurelia_templating_1.ViewResources, style_engine_1.StyleEngine, aurelia_dependency_injection_1.Container, aurelia_templating_1.ViewCompiler, aurelia_templating_1.ViewSlot),
            aurelia_templating_1.customElement('ux-option'),
            aurelia_templating_1.processAttributes(design_attributes_1.processDesignAttributes)
        ], UxOption);
        return UxOption;
    }());
    exports.UxOption = UxOption;
    function createViewFactory(viewCompiler, container, html) {
        if (!html || !html.startsWith('<template>')) {
            html = "<template>" + html + "</template>";
        }
        var viewResources = container.get(aurelia_templating_1.ViewResources);
        var viewFactory = viewCompiler.compile(html, viewResources);
        return viewFactory;
    }
    function createView(viewFactory, container) {
        var childContainer = container.createChild();
        var view = viewFactory.create(childContainer);
        return view;
    }
});
