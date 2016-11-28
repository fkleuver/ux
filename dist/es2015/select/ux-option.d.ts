import { ViewResources, View, ViewSlot, ViewCompiler } from 'aurelia-templating';
import { TaskQueue } from 'aurelia-task-queue';
import { Container } from 'aurelia-dependency-injection';
import { StyleEngine } from '../styles/style-engine';
import { Themable } from '../styles/themable';
export declare class UxOption implements Themable {
    private tq;
    resources: ViewResources;
    private styleEngine;
    private container;
    private viewCompiler;
    private viewSlot;
    theme: any;
    option: string;
    html: string;
    textProperty: string;
    selected: boolean;
    view: View;
    private bindingContext;
    private overrideContext;
    private isApplied;
    private isAttached;
    private innerView;
    private innerViewFactory;
    constructor(tq: TaskQueue, resources: ViewResources, styleEngine: StyleEngine, container: Container, viewCompiler: ViewCompiler, viewSlot: ViewSlot);
    created(_: any, myView: View): void;
    bind(bindingContext: any, overrideContext: any): void;
    attached(): void;
    detached(): void;
    unbind(): void;
    themeChanged(newValue: any): void;
    protected htmlChanged(newValue: string): void;
    private apply();
    private disposeView();
    private compileView();
}
