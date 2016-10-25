System.register(['../styles/decorators'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var decorators_1;
    var XpButtonStyles;
    return {
        setters:[
            function (decorators_1_1) {
                decorators_1 = decorators_1_1;
            }],
        execute: function() {
            XpButtonStyles = (function () {
                function XpButtonStyles() {
                    this.raised = true;
                }
                XpButtonStyles = __decorate([
                    decorators_1.styles()
                ], XpButtonStyles);
                return XpButtonStyles;
            }());
            exports_1("XpButtonStyles", XpButtonStyles);
        }
    }
});