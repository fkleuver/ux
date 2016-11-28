"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var decorators_1 = require('../styles/decorators');
var UxSelectTheme = (function () {
    function UxSelectTheme() {
        this.inDuration = 300;
        this.outDuration = 225;
        this.constrain_width = true;
        this.hover = false;
        this.gutter = 0;
        this.beloworigin = false;
        this.alignment = 'left';
        this.stopPropagation = false;
    }
    UxSelectTheme = __decorate([
        decorators_1.styles()
    ], UxSelectTheme);
    return UxSelectTheme;
}());
exports.UxSelectTheme = UxSelectTheme;
